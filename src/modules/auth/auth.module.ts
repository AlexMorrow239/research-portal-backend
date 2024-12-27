import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ProfessorsModule } from '../professors/professors.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Professor, ProfessorSchema } from '../professors/schemas/professors.schema';

@Module({
  imports: [
    ProfessorsModule,
    MongooseModule.forFeature([{ name: Professor.name, schema: ProfessorSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
