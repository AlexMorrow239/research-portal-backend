import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { EmailTrackingService } from '../email-tracking.service';
import { EmailTracking } from '../schemas/email-tracking.schema';

describe('EmailTrackingService', () => {
  let service: EmailTrackingService;
  let emailTrackingModel: Model<EmailTracking>;

  const mockEmailTracking = {
    application: '507f1f77bcf86cd799439011',
    project: '507f1f77bcf86cd799439012',
    token: 'test-token-123',
    clicks: 0,
    hasBeenViewed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailTrackingService,
        {
          provide: getModelToken(EmailTracking.name),
          useValue: {
            create: jest.fn(),
            findOneAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmailTrackingService>(EmailTrackingService);
    emailTrackingModel = module.get<Model<EmailTracking>>(getModelToken(EmailTracking.name));
  });

  describe('createTrackingToken', () => {
    it('should create a tracking token successfully', async () => {
      jest.spyOn(emailTrackingModel, 'create').mockResolvedValue(mockEmailTracking as any);

      const token = await service.createTrackingToken(
        mockEmailTracking.application,
        mockEmailTracking.project,
      );

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(emailTrackingModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          application: mockEmailTracking.application,
          project: mockEmailTracking.project,
          hasBeenViewed: false,
        }),
      );
    });
  });

  describe('createTestTrackingToken', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('should create a test tracking token in development', async () => {
      process.env.NODE_ENV = 'development';
      jest.spyOn(emailTrackingModel, 'create').mockResolvedValue(mockEmailTracking as any);

      const result = await service.createTestTrackingToken(
        mockEmailTracking.application,
        mockEmailTracking.project,
      );

      expect(result.token).toBeDefined();
      expect(result.tracking).toBeDefined();
      expect(emailTrackingModel.create).toHaveBeenCalled();
    });

    it('should throw error in production environment', async () => {
      process.env.NODE_ENV = 'production';

      await expect(
        service.createTestTrackingToken(mockEmailTracking.application, mockEmailTracking.project),
      ).rejects.toThrow('Test endpoints are not available in production');
    });
  });

  describe('trackClick', () => {
    it('should update tracking data on click', async () => {
      const updatedTracking = {
        ...mockEmailTracking,
        clicks: 1,
        hasBeenViewed: true,
        lastClickedAt: new Date(),
      };

      jest.spyOn(emailTrackingModel, 'findOneAndUpdate').mockResolvedValue(updatedTracking as any);

      await service.trackClick('test-token-123');

      expect(emailTrackingModel.findOneAndUpdate).toHaveBeenCalledWith(
        { token: 'test-token-123' },
        expect.objectContaining({
          $inc: { clicks: 1 },
          $set: expect.objectContaining({
            hasBeenViewed: true,
          }),
        }),
        expect.any(Object),
      );
    });

    it('should throw NotFoundException for invalid token', async () => {
      jest.spyOn(emailTrackingModel, 'findOneAndUpdate').mockResolvedValue(null);

      await expect(service.trackClick('invalid-token')).rejects.toThrow(NotFoundException);
    });
  });
});
