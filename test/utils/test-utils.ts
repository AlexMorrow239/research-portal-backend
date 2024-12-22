import { JwtService } from '@nestjs/jwt';
import { Professor } from '../../src/modules/professors/schemas/professors.schema';
import * as bcrypt from 'bcrypt';

export const TEST_ADMIN_PASSWORD = 'test-admin-password';

export const createTestProfessor = async (): Promise<Professor> => {
  const hashedPassword = await bcrypt.hash('testPassword123', 10);
  
  return {
    _id: 'test-professor-id',
    username: 'testprof',
    password: hashedPassword,
    name: {
      firstName: 'Test',
      lastName: 'Professor'
    },
    email: 'testprof@miami.edu',
    department: 'Computer Science',
    isActive: true,
    toObject: () => ({
      _id: 'test-professor-id',
      username: 'testprof',
      name: {
        firstName: 'Test',
        lastName: 'Professor'
      },
      email: 'testprof@miami.edu',
      department: 'Computer Science',
      isActive: true,
    })
  } as Professor;
};

export const generateTestToken = (professor: Professor): string => {
  const jwtService = new JwtService({ secret: 'test-secret' });
  
  return jwtService.sign({
    sub: professor._id,
    username: professor.username,
    email: professor.email,
  });
};

// Helper to create test data with custom values
export const createCustomTestProfessor = async (overrides: Partial<Professor> = {}): Promise<Professor> => {
  const baseProfessor = await createTestProfessor();
  const customProfessor = {
    ...baseProfessor,
    ...overrides,
    toObject: () => ({
      ...baseProfessor.toObject(),
      ...overrides,
    })
  };
  
  return customProfessor as Professor;
};