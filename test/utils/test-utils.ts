import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Professor } from '@/modules/professors/schemas/professors.schema';

export const createTestProfessor = async (): Promise<Professor> => {
  const hashedPassword = await bcrypt.hash('testPassword123', 10);

  return {
    _id: 'test-professor-id',
    email: 'testprof@miami.edu',
    password: hashedPassword,
    name: {
      firstName: 'Test',
      lastName: 'Professor',
    },
    department: 'Computer Science',
    isActive: true,
    toObject: () => ({
      _id: 'test-professor-id',
      email: 'testprof@miami.edu',
      name: {
        firstName: 'Test',
        lastName: 'Professor',
      },
      department: 'Computer Science',
      isActive: true,
    }),
  } as Professor;
};

export const generateTestToken = (professor: Professor): string => {
  const jwtService = new JwtService({ secret: 'test-secret' });

  return jwtService.sign({
    sub: professor._id,
    email: professor.email,
  });
};
