import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project, ProjectSchema } from './schemas/projects.schema';
import { ProfessorsModule } from '../professors/professors.module';
import { FileStorageModule } from '../file-storage/file-storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
    ]),
    ProfessorsModule,
    FileStorageModule,
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}