import { Injectable } from '@nestjs/common';
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

  async createTrackingToken(applicationId: string): Promise<string> {
    const token = uuidv4();
    await this.emailTrackingModel.create({
      application: applicationId,
      token,
    });
    return token;
  }

  async trackClick(token: string): Promise<void> {
    await this.emailTrackingModel.findOneAndUpdate(
      { token },
      {
        $inc: { clicks: 1 },
        lastClickedAt: new Date(),
      },
    );
  }

  async getGlobalClickStats(): Promise<{ totalEmails: number; totalClicks: number }> {
    const stats = await this.emailTrackingModel.aggregate([
      {
        $group: {
          _id: null,
          totalEmails: { $sum: 1 },
          totalClicks: { $sum: '$clicks' },
        },
      },
    ]);

    return stats[0] || { totalEmails: 0, totalClicks: 0 };
  }
}
