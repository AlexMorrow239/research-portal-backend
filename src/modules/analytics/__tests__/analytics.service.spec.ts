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
      });
    });

    it('should update interview metrics correctly', async () => {
      mockAnalyticsModel.findOne.mockResolvedValue({ project: 'project123' });

      await service.updateApplicationMetrics(
        'project123',
        ApplicationStatus.PENDING,
        ApplicationStatus.INTERVIEW,
      );

      expect(mockAnalyticsModel.updateOne).toHaveBeenCalledWith(
        { project: 'project123' },
        { $inc: { totalInterviews: 1 } },
      );
    });

    it('should update offer acceptance metrics correctly', async () => {
      mockAnalyticsModel.findOne.mockResolvedValue({ project: 'project123' });

      await service.updateApplicationMetrics(
        'project123',
        ApplicationStatus.INTERVIEW,
        ApplicationStatus.OFFER_ACCEPTED,
      );

      expect(mockAnalyticsModel.updateOne).toHaveBeenCalledWith(
        { project: 'project123' },
        { $inc: { totalAcceptedOffers: 1 } },
      );
    });
  });

  describe('getProjectAnalytics', () => {
    it('should return formatted project analytics', async () => {
      const mockApplicationMetrics = {
        totalApplications: 100,
        totalInterviews: 50,
        totalAcceptedOffers: 25,
        totalDeclinedOffers: 10,
      };

      const mockEmailStats = {
        projectStats: [
          {
            projectId: 'project123',
            emailsSent: 100,
            totalClicks: 75,
            uniqueViews: 50,
          },
        ],
      };

      mockAnalyticsModel.findOne.mockResolvedValue(mockApplicationMetrics);
      mockEmailTrackingService.getGlobalClickStats.mockResolvedValue(mockEmailStats);

      const result = await service.getProjectAnalytics('project123');

      expect(result.emailEngagement).toBeDefined();
      expect(result.applicationFunnel).toBeDefined();
      expect(result.applicationFunnel.interviewRate).toBe(50);
      expect(result.emailEngagement.viewRate).toBe(50);
    });
  });

  describe('getGlobalAnalytics', () => {
    it('should return formatted global analytics', async () => {
      const mockAggregateResult = [
        {
          totalApplications: 200,
          totalInterviews: 100,
          totalAcceptedOffers: 50,
          totalDeclinedOffers: 20,
        },
      ];

      const mockEmailStats = {
        emailsSent: 200,
        totalClicks: 150,
        uniqueViews: 100,
      };

      mockAnalyticsModel.aggregate.mockResolvedValue(mockAggregateResult);
      mockEmailTrackingService.getGlobalClickStats.mockResolvedValue(mockEmailStats);

      const result = await service.getGlobalAnalytics();

      expect(result.emailEngagement).toBeDefined();
      expect(result.applicationFunnel).toBeDefined();
      expect(result.applicationFunnel.interviewRate).toBe(50);
      expect(result.emailEngagement.viewRate).toBe(50);
    });
  });
});
