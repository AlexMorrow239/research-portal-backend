import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import { join } from 'path';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Handles file operations with size and type validation
@Injectable()
export class FileStorageService {
  private readonly uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = configService.get('UPLOAD_DIR', 'uploads');
    this.initializeUploadDir();
  }

  private async initializeUploadDir() {
    try {
      if (!existsSync(this.uploadDir)) {
        await fs.mkdir(this.uploadDir, { recursive: true });
      }
    } catch (error) {
      console.error('Error creating upload directory:', error);
      throw error;
    }
  }

  // Save and validate uploaded files
  async saveFile(
    file: Express.Multer.File,
    subDir: string,
    isProjectFile: boolean = false,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Allowed types: PDF, DOC, DOCX');
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const fullDir = isProjectFile
      ? join(this.uploadDir, 'projects', subDir)
      : join(this.uploadDir, subDir);
    const fullPath = join(fullDir, fileName);

    try {
      await fs.mkdir(fullDir, { recursive: true });
      await fs.writeFile(fullPath, file.buffer);
      return isProjectFile ? join('projects', subDir, fileName) : join(subDir, fileName);
    } catch (error) {
      console.error('Error saving file:', error);
      throw new BadRequestException('Error saving file');
    }
  }

  async getFile(
    fileName: string,
    isProjectFile: boolean = false,
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    const filePath = isProjectFile
      ? join(this.uploadDir, 'projects', fileName)
      : join(this.uploadDir, fileName);

    try {
      const buffer = await fs.readFile(filePath);
      const mimeType = this.getMimeType(fileName);
      return { buffer, mimeType };
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }

  async deleteFile(fileName: string, isProjectFile: boolean = false): Promise<void> {
    const filePath = isProjectFile
      ? join(this.uploadDir, 'projects', fileName)
      : join(this.uploadDir, fileName);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Error deleting file:', error);
        throw new BadRequestException('Error deleting file');
      }
    }
  }

  private getMimeType(fileName: string): string {
    const ext = fileName.toLowerCase().split('.').pop();
    switch (ext) {
      case 'pdf':
        return 'application/pdf';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return 'application/octet-stream';
    }
  }
}
