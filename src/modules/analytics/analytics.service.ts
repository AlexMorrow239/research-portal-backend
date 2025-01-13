import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { AnalyticsDto } from '@/common/dto/analytics/analytics.dto';
import { ApplicationStatus } from '@/common/enums';

import { EmailTrackingService } from '../email/email-tracking.service';

import { ApplicationAnalytics } from './schemas/application-analytics.schema';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectModel(ApplicationAnalytics.name)
    private analyticsModel: Model<ApplicationAnalytics>,
    private readonly emailTrackingService: EmailTrackingService,
  ) {}

  async updateApplicationMetrics(
    projectId: string,
    oldStatus: ApplicationStatus | null,
    newStatus: ApplicationStatus,
  ) {
    try {
      const analytics = await this.analyticsModel.findOne({ project: projectId });

      if (!analytics) {
        return await this.analyticsModel.create({
          project: projectId,
          totalApplications: 1,
          pendingApplications: newStatus === ApplicationStatus.PENDING ? 1 : 0,
          closedApplications: newStatus === ApplicationStatus.CLOSED ? 1 : 0,
        });
      }

      const update: any = {};

      // Handle new application
      if (!oldStatus) {
        update.$inc = {
          totalApplications: 1,
          pendingApplications: newStatus === ApplicationStatus.PENDING ? 1 : 0,
          closedApplications: newStatus === ApplicationStatus.CLOSED ? 1 : 0,
        };
      }
      // Handle status changes
      else if (oldStatus !== newStatus) {
        update.$inc = {};

        // Decrement old status count
        if (oldStatus === ApplicationStatus.PENDING) {
          update.$inc.pendingApplications = -1;
        }

        // Increment new status count
        if (newStatus === ApplicationStatus.CLOSED) {
          update.$inc.closedApplications = 1;
        }
      }

      if (Object.keys(update).length > 0) {
        await this.analyticsModel.updateOne({ project: projectId }, update);
      }
    } catch (error) {
      this.logger.error(`Failed to update analytics for project ${projectId}`, error.stack);
    }
  }

  async getProjectAnalytics(projectId: string): Promise<AnalyticsDto> {
    try {
      const [applicationMetrics, emailMetrics] = await Promise.all([
        this.analyticsModel.findOne({ project: projectId }),
        this.emailTrackingService.getGlobalClickStats(),
      ]);

      const projectEmailStats = emailMetrics.projectStats.find(
        (stats) => stats.projectId === projectId,
      ) || {
        emailsSent: 0,
        totalClicks: 0,
        uniqueViews: 0,
      };

      return this.formatAnalytics(applicationMetrics, projectEmailStats);
    } catch (error) {
      this.logger.error(`Failed to get analytics for project ${projectId}`, error.stack);
      throw error;
    }
  }

  async getGlobalAnalytics(): Promise<AnalyticsDto> {
    try {
      const [applicationTotals, emailMetrics] = await Promise.all([
        this.analyticsModel.aggregate([
          {
            $group: {
              _id: null,
              totalApplications: { $sum: '$totalApplications' },
              pendingApplications: { $sum: '$pendingApplications' },
              closedApplications: { $sum: '$closedApplications' },
            },
          },
        ]),
        this.emailTrackingService.getGlobalClickStats(),
      ]);

      return this.formatAnalytics(applicationTotals[0] || {}, emailMetrics);
    } catch (error) {
      this.logger.error('Failed to get global analytics', error.stack);
      throw error;
    }
  }

  private formatAnalytics(applicationMetrics: any, emailMetrics: any): AnalyticsDto {
    const {
      totalApplications = 0,
      pendingApplications = 0,
      closedApplications = 0,
    } = applicationMetrics;

    const { emailsSent = 0, uniqueViews = 0, totalClicks = 0 } = emailMetrics;

    return {
      emailEngagement: {
        totalEmails: emailsSent,
        totalViews: uniqueViews,
        totalClicks,
        viewRate: emailsSent > 0 ? (uniqueViews / emailsSent) * 100 : 0,
        averageClicksPerEmail: emailsSent > 0 ? totalClicks / emailsSent : 0,
      },
      applicationFunnel: {
        totalApplications,
        pendingApplications,
        closedApplications,
        closeRate: totalApplications > 0 ? (closedApplications / totalApplications) * 100 : 0,
      },
      lastUpdated: new Date(),
    };
  }
}
