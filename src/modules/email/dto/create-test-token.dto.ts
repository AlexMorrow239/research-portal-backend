import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateTestTokenDto {
  @ApiProperty({
    description: 'ID of the application',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsMongoId()
  applicationId: string;

  @ApiProperty({
    description: 'ID of the project',
    example: '507f1f77bcf86cd799439012',
  })
  @IsNotEmpty()
  @IsMongoId()
  projectId: string;
}
