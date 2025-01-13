import { Test, TestingModule } from '@nestjs/testing';

import { AnalyticsController } from '../analytics.controller';
import { AnalyticsService } from '../analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  const mockAnalyticsService = {
    getProjectAnalytics: jest.fn(),
    getGlobalAnalytics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('getProjectAnalytics', () => {
    it('should return project analytics', async () => {
      const mockAnalytics = {
        emailEngagement: {
          totalEmails: 100,
          totalViews: 75,
          totalClicks: 50,
          viewRate: 75,
          averageClicksPerEmail: 0.5,
        },
        applicationFunnel: {
          totalApplications: 100,
          pendingApplications: 75,
          closedApplications: 25,
          closeRate: 25,
        },
        lastUpdated: new Date(),
      };

      mockAnalyticsService.getProjectAnalytics.mockResolvedValue(mockAnalytics);

      const result = await controller.getProjectAnalytics('project123');

      expect(result).toBe(mockAnalytics);
      expect(service.getProjectAnalytics).toHaveBeenCalledWith('project123');
    });
  });

  describe('getGlobalAnalytics', () => {
    it('should return global analytics', async () => {
      const mockGlobalAnalytics = {
        emailEngagement: {
          totalEmails: 1000,
          totalViews: 750,
          totalClicks: 500,
          viewRate: 75,
          averageClicksPerEmail: 0.5,
        },
        applicationFunnel: {
          totalApplications: 1000,
          pendingApplications: 750,
          closedApplications: 250,
          closeRate: 25,
        },
        lastUpdated: new Date(),
      };

      mockAnalyticsService.getGlobalAnalytics.mockResolvedValue(mockGlobalAnalytics);

      const result = await controller.getGlobalAnalytics();

      expect(result).toBe(mockGlobalAnalytics);
      expect(service.getGlobalAnalytics).toHaveBeenCalled();
    });
  });
});
