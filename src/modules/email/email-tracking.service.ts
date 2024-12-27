import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { EmailTracking } from './schemas/email-tracking.schema';

@Injectable()
export class EmailTrackingService {
  constructor(
    @InjectModel(EmailTracking.name)
    private emailTrackingModel: Model<EmailTracking>,
  ) {}

  async createTrackingToken(applicationId: string, projectId: string): Promise<string> {
    const token = uuidv4();

    await this.emailTrackingModel.create({
      application: applicationId,
      project: projectId,
      token,
      hasBeenViewed: false,
    });

    return token;
  }

  async createTestTrackingToken(
    applicationId: string,
    projectId: string,
  ): Promise<{ token: string; tracking: EmailTracking }> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Test endpoints are not available in production');
    }

    const token = uuidv4();
    const tracking = await this.emailTrackingModel.create({
      application: applicationId,
      project: projectId,
      token,
      hasBeenViewed: false,
    });

    return { token, tracking };
  }

  async trackClick(token: string): Promise<void> {
    const result = await this.emailTrackingModel.findOneAndUpdate(
      { token },
      {
        $inc: { clicks: 1 },
        $set: {
          lastClickedAt: new Date(),
          hasBeenViewed: true,
        },
        $push: { clickTimestamps: new Date() },
        $setOnInsert: { firstClickedAt: new Date() },
      },
      { new: true, runValidators: true },
    );

    if (!result) {
      throw new NotFoundException('Invalid tracking token');
    }
  }

  async getGlobalClickStats(): Promise<{
    totalEmails: number;
    totalClicks: number;
    averageClicksPerEmail: number;
    totalViewed: number;
    viewRate: number;
    projectStats: {
      projectId: string;
      title: string;
      emailsSent: number;
      totalClicks: number;
      uniqueViews: number;
    }[];
  }> {
    const stats = await this.emailTrackingModel.aggregate([
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'projectData',
        },
      },
      {
        $group: {
          _id: null,
          totalEmails: { $sum: 1 },
          totalClicks: { $sum: '$clicks' },
          totalViewed: { $sum: { $cond: ['$hasBeenViewed', 1, 0] } },
          projectStats: {
            $push: {
              projectId: '$project',
              title: { $first: '$projectData.title' },
              clicks: '$clicks',
              viewed: '$hasBeenViewed',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalEmails: 1,
          totalClicks: 1,
          totalViewed: 1,
          viewRate: { $multiply: [{ $divide: ['$totalViewed', '$totalEmails'] }, 100] },
          averageClicksPerEmail: { $divide: ['$totalClicks', '$totalEmails'] },
          projectStats: 1,
        },
      },
    ]);

    const result = stats[0] || {
      totalEmails: 0,
      totalClicks: 0,
      totalViewed: 0,
      viewRate: 0,
      averageClicksPerEmail: 0,
      projectStats: [],
    };

    return result;
  }
}
