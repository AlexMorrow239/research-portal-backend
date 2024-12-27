import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const ValidateAdminPassword = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { adminPassword } = request.body;
    const configService = new ConfigService();

    const correctAdminPassword = configService.get<string>('ADMIN_PASSWORD');

    if (adminPassword !== correctAdminPassword) {
      throw new UnauthorizedException('Invalid admin password');
    }

    return adminPassword;
  },
);
