import { UnauthorizedException, BadRequestException, ConflictException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { TestingModule, Test } from "@nestjs/testing";
import { TEST_ADMIN_PASSWORD } from "@test/utils/test-utils";
import { Model, Document } from "mongoose";
import { ProfessorsService } from "../professors.service";
import { Professor } from "../schemas/professors.schema";

describe('ProfessorsService', () => {
  let service: ProfessorsService;
  let model: Model<Professor>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessorsService,
        {
          provide: getModelToken(Professor.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(TEST_ADMIN_PASSWORD),
          },
        },
      ],
    }).compile();

    service = module.get<ProfessorsService>(ProfessorsService);
    model = module.get<Model<Professor>>(getModelToken(Professor.name));
    configService = module.get<ConfigService>(ConfigService);
  });

  // describe('create', () => {
  //   const validCreateProfessorDto = {
  //     username: 'testprof',
  //     password: 'Password123!',
  //     adminPassword: TEST_ADMIN_PASSWORD,
  //     name: {
  //       firstName: 'Test',
  //       lastName: 'Professor'
  //     },
  //     email: 'test@miami.edu',
  //     department: 'Computer Science',
  //     title: 'Associate Professor',
  //     researchAreas: ['AI', 'Machine Learning'],
  //     office: 'Room 123',
  //     phoneNumber: '305-123-4567',
  //     bio: 'Test bio'
  //   };

  //   it('should successfully create a professor with valid data', async () => {
  //     jest.spyOn(model, 'findOne').mockResolvedValue(null);
  //     jest.spyOn(model, 'create').mockImplementation((dto: any) => {
  //       // If dto is an array, handle first element (matches your test case needs)
  //       const data = Array.isArray(dto) ? dto[0] : dto;
        
  //       const professor = {
  //         ...data,
  //         _id: 'test-id',
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //         isActive: true,
  //         toObject: function() {
  //           const obj = {
  //             ...this,
  //             _id: 'test-id',
  //           };
  //           // Remove methods from the object representation
  //           delete obj.toObject;
  //           return obj;
  //         }
  //       };

  //   // Return as promise of array to match Mongoose's create behavior
  //   return Promise.resolve([professor] as Professor[]);
  // });

  //     const result = await service.create(validCreateProfessorDto);

  //     expect(result).toBeDefined();
  //     expect(result.username).toBe(validCreateProfessorDto.username);
  //     expect(result).not.toHaveProperty('password');
  //     expect(result).not.toHaveProperty('adminPassword');
  //   });

  //   it('should throw UnauthorizedException with invalid admin password', async () => {
  //     const invalidDto = {
  //       ...validCreateProfessorDto,
  //       adminPassword: 'wrong-password',
  //     };

  //     await expect(service.create(invalidDto)).rejects.toThrow(UnauthorizedException);
  //   });

  //   it('should throw BadRequestException with invalid email domain', async () => {
  //     const invalidDto = {
  //       ...validCreateProfessorDto,
  //       email: 'test@gmail.com',
  //     };

  //     await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
  //   });

  //   it('should throw ConflictException when username already exists', async () => {
  //     jest.spyOn(model, 'findOne').mockResolvedValue({ username: 'testprof' } as Professor);

  //     await expect(service.create(validCreateProfessorDto)).rejects.toThrow(ConflictException);
  //   });

  //   it('should throw BadRequestException with weak password', async () => {
  //     const weakPasswordDto = {
  //       ...validCreateProfessorDto,
  //       password: 'weak',
  //     };

  //     await expect(service.create(weakPasswordDto)).rejects.toThrow(BadRequestException);
  //   });
  // });
});