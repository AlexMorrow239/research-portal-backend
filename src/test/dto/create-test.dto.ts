import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTestDto {
  @ApiProperty({ description: 'The name of the test item' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}