import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Model } from 'mongoose';

import { ApplicationStatus } from '@/common/enums';

import { EmailTrackingService } from '../../email/email-tracking.service';

import { AnalyticsService } from '../analytics.service';
import { ApplicationAnalytics } from '../schemas/application-analytics.schema';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let _analyticsModel: Model<ApplicationAnalytics>;
  let _emailTrackingService: EmailTrackingService;

  const mockAnalyticsModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    aggregate: jest.fn(),
  };

  const mockEmailTrackingService = {
    getGlobalClickStats: jest.fn(),
  };

  jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getModelToken(ApplicationAnalytics.name),
          useValue: mockAnalyticsModel,
        },
        {
          provide: EmailTrackingService,
          useValue: mockEmailTrackingService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    _analyticsModel = module.get<Model<ApplicationAnalytics>>(
      getModelToken(ApplicationAnalytics.name),
    );
    _emailTrackingService = module.get<EmailTrackingService>(EmailTrackingService);
  });

  describe('updateApplicationMetrics', () => {
    it('should create new analytics for new project', async () => {
      mockAnalyticsModel.findOne.mockResolvedValue(null);
      mockAnalyticsModel.create.mockResolvedValue({ totalApplications: 1 });

      await service.updateApplicationMetrics('project123', null, ApplicationStatus.PENDING);

      expect(mockAnalyticsModel.create).toHaveBeenCalledWith({
        project: 'project123',
        totalApplications: 1,
        pendingApplications: 1,
        closedApplications: 0,
      });
    });

    it('should update metrics when application is closed', async () => {
      mockAnalyticsModel.findOne.mockResolvedValue({
        project: 'project123',
        pendingApplications: 1,
        closedApplications: 0,
      });

      await service.updateApplicationMetrics(
        'project123',
        ApplicationStatus.PENDING,
        ApplicationStatus.CLOSED,
      );

      expect(mockAnalyticsModel.updateOne).toHaveBeenCalledWith(
        { project: 'project123' },
        {
          $inc: {
            pendingApplications: -1,
            closedApplications: 1,
          },
        },
      );
    });

    it('should handle errors gracefully', async () => {
      mockAnalyticsModel.findOne.mockRejectedValue(new Error('Database error'));

      await service.updateApplicationMetrics(
        'project123',
        ApplicationStatus.PENDING,
        ApplicationStatus.CLOSED,
      );
    });
  });
});
