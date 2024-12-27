import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { EmailTrackingService } from './email-tracking.service';

@Controller('track')
export class EmailTrackingController {
  constructor(private readonly emailTrackingService: EmailTrackingService) {}

  @Get(':token')
  async trackAndRedirect(@Param('token') token: string, @Res() res: Response) {
    await this.emailTrackingService.trackClick(token);

    // Simple HTML placeholder page
    res.send(`
      <html>
        <body>
          <h1>Research Portal</h1>
          <p>The frontend is under construction. Please check back later.</p>
          <p>Token: ${token}</p>
        </body>
      </html>
    `);
  }
}
