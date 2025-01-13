import { ApplicationStatus } from '@/common/enums';

export const mockFileStorageService = {
  saveFile: jest.fn().mockResolvedValue('mock-file-name'),
  getFile: jest.fn().mockResolvedValue({ buffer: Buffer.from('mock-file') }),
  deleteFile: jest.fn().mockResolvedValue(undefined),
};

export const mockEmailService = {
  sendProjectClosedNotification: jest.fn().mockResolvedValue(undefined),
};

export const mockApplicationsService = {
  findProjectApplications: jest.fn().mockResolvedValue([
    {
      studentInfo: { email: 'student@test.com' },
      status: ApplicationStatus.PENDING,
    },
  ]),
  closeProjectApplications: jest.fn().mockResolvedValue(undefined),
};

export const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
};
