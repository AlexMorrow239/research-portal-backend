import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWriteStream, existsSync, mkdirSync, unlink } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const unlinkAsync = promisify(unlink);

@Injectable()
export class FileStorageService {
  private readonly uploadDir: string;
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes: string[];

  constructor(private configService: ConfigService) {
    this.uploadDir = configService.get('UPLOAD_DIR', 'uploads');
    this.maxFileSize = configService.get('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB default
    this.allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    // Create uploads directory if it doesn't exist
    if (!existsSync(this.uploadDir)) {
        mkdirSync(this.uploadDir, { recursive: true });
        }
  }

  async saveFile(file: Express.Multer.File, projectId: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File size exceeds ${this.maxFileSize / 1024 / 1024}MB limit`);
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Allowed types: PDF, DOC, DOCX');
    }

    const fileName = `${projectId}-${Date.now()}-${file.originalname}`;
    const filePath = join(this.uploadDir, fileName);

    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      writeStream.write(file.buffer);
      writeStream.end();

      writeStream.on('finish', () => resolve(fileName));
      writeStream.on('error', reject);
    });
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await unlinkAsync(join(this.uploadDir, fileName));
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
}