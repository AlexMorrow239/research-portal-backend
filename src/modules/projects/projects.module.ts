import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ApplicationsModule } from '@/modules/applications/applications.module';
import { EmailModule } from '@/modules/email/email.module';

import { FileStorageModule } from '../file-storage/file-storage.module';
import { ProfessorsModule } from '../professors/professors.module';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project, ProjectSchema } from './schemas/projects.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    ProfessorsModule,
    FileStorageModule,
    EmailModule,
    forwardRef(() => ApplicationsModule),
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
