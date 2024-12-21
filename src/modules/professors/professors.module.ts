import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessorsService } from './professors.service';
import { ProfessorsController } from './professors.controller';
import { Professor, ProfessorSchema } from './schemas/professors.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Professor.name, schema: ProfessorSchema },
    ]),
    ConfigModule,
  ],
  providers: [ProfessorsService],
  controllers: [ProfessorsController], 
  exports: [ProfessorsService],
})
export class ProfessorsModule {}