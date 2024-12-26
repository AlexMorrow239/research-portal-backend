import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application, ApplicationSchema } from './schemas/applications.schema';
import { ProjectsModule } from '../projects/projects.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
    ]),
    ProjectsModule,
    FileStorageModule,
    EmailModule
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
  exports: [ApplicationsService], // Add exports if other modules need access
})
export class ApplicationsModule {}