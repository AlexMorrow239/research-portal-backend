import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { AppModule } from './../src/app.module';
import * as bcrypt from 'bcrypt';
import { TEST_ADMIN_PASSWORD } from './utils/test-utils';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongoConnection: Connection;
  const testPassword = 'testpassword';

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.ADMIN_PASSWORD = TEST_ADMIN_PASSWORD;
  
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  
    app = moduleFixture.createNestApplication();
    
    // Add global pipes and filters
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
    
    mongoConnection = moduleFixture.get(getConnectionToken());
    
    await app.init();
  });

  beforeEach(async () => {
    // Clean database
    const collections = mongoConnection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await app.close();
  });

  describe('Root endpoint', () => {
    it('should return "Research Portal API"', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Research Portal API');
    });
  });

  describe('Professor Registration', () => {
    it('should register a new professor with valid admin password', () => {
      return request(app.getHttpServer())
        .post('/professors')
        .send({
          username: 'newprof',
          password: 'validpassword123',
          adminPassword: TEST_ADMIN_PASSWORD,
          name: {
            firstName: 'New',
            lastName: 'Professor'
          },
          email: 'newprof@miami.edu',
          department: 'Computer Science'
        })
        .expect(201)
        .expect(res => {
          expect(res.body).toHaveProperty('username', 'newprof');
          expect(res.body).not.toHaveProperty('password');
          expect(res.body).not.toHaveProperty('adminPassword');
        });
    });

    it('should reject registration with invalid admin password', () => {
      return request(app.getHttpServer())
        .post('/professors')
        .send({
          username: 'newprof',
          password: 'validpassword123',
          adminPassword: 'wrong-admin-password',
          name: {
            firstName: 'New',
            lastName: 'Professor'
          },
          email: 'newprof@miami.edu',
          department: 'Computer Science'
        })
        .expect(401)
        .expect(res => {
          expect(res.body.message).toBe('Invalid admin password');
        });
    });

    it('should reject registration with invalid email domain', () => {
      return request(app.getHttpServer())
        .post('/professors')
        .send({
          username: 'newprof',
          password: 'validpassword123',
          adminPassword: TEST_ADMIN_PASSWORD,
          name: {
            firstName: 'New',
            lastName: 'Professor'
          },
          email: 'newprof@wrongdomain.com',
          department: 'Computer Science'
        })
        .expect(400);
    });

    it('should reject registration with duplicate username', async () => {
      // First create a professor
      await request(app.getHttpServer())
        .post('/professors')
        .send({
          username: 'existingprof',
          password: 'validpassword123',
          adminPassword: TEST_ADMIN_PASSWORD,
          name: {
            firstName: 'Existing',
            lastName: 'Professor'
          },
          email: 'existing@miami.edu',
          department: 'Computer Science'
        })
        .expect(201);

      // Try to create another professor with the same username
      return request(app.getHttpServer())
        .post('/professors')
        .send({
          username: 'existingprof',
          password: 'validpassword123',
          adminPassword: TEST_ADMIN_PASSWORD,
          name: {
            firstName: 'New',
            lastName: 'Professor'
          },
          email: 'new@miami.edu',
          department: 'Computer Science'
        })
        .expect(409)
        .expect(res => {
          expect(res.body.message).toBe('Username or email already exists');
        });
    });
  });

  describe('Authentication', () => {
    beforeEach(async () => {
      // Create test professor with properly hashed password
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const professorsCollection = mongoConnection.collection('professors');
      await professorsCollection.insertOne({
        username: 'testprof',
        password: hashedPassword,
        name: {
          firstName: 'Test',
          lastName: 'Professor'
        },
        email: 'test@miami.edu',
        department: 'Computer Science'
      });
    });

    it('should authenticate valid professor credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testprof',
          password: testPassword,
        })
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('professor');
          expect(res.body.professor).toHaveProperty('username', 'testprof');
        });
    });

    it('should reject invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testprof',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Protected Routes', () => {
    let authToken: string;

    beforeEach(async () => {
      // Create test professor
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      const professorsCollection = mongoConnection.collection('professors');
      await professorsCollection.insertOne({
        username: 'testprof',
        password: hashedPassword,
        name: {
          firstName: 'Test',
          lastName: 'Professor'
        },
        email: 'test@miami.edu',
        department: 'Computer Science'
      });

      // Get auth token
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'testprof',
          password: testPassword,
        });
      
      authToken = loginResponse.body.accessToken;
    });

    it('should access protected route with valid token', () => {
      return request(app.getHttpServer())
        .get('/professors/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect(res => {
          expect(res.body).toHaveProperty('username', 'testprof');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should reject access without token', () => {
      return request(app.getHttpServer())
        .get('/professors/profile')
        .expect(401);
    });

    it('should update professor profile with valid token', () => {
      return request(app.getHttpServer())
        .patch('/professors/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: {
            firstName: 'Updated',
            lastName: 'Name'
          },
          title: 'Associate Professor',
          office: 'Room 123'
        })
        .expect(200)
        .expect(res => {
          expect(res.body.name.firstName).toBe('Updated');
          expect(res.body.name.lastName).toBe('Name');
          expect(res.body.title).toBe('Associate Professor');
          expect(res.body.office).toBe('Room 123');
        });
    });
  });
});