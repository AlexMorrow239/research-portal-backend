import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, ValidateNested, ArrayMinSize } from 'class-validator';
import { RacialEthnicGroup, Citizenship } from '@common/enums/application.enums';
import { StudentBasicInfoDto } from './student-basic-info.dto';
import { StudentAcademicInfoDto } from './student-academic-info.dto';

export class StudentInfoDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => StudentBasicInfoDto)
  basicInfo: StudentBasicInfoDto;

  @ApiProperty({ enum: RacialEthnicGroup, isArray: true })
  @IsEnum(RacialEthnicGroup, { each: true })
  @IsArray()
  @ArrayMinSize(1)
  racialEthnicGroups: RacialEthnicGroup[];

  @ApiProperty({ enum: Citizenship })
  @IsEnum(Citizenship)
  citizenship: Citizenship;

  @ApiProperty()
  @ValidateNested()
  @Type(() => StudentAcademicInfoDto)
  academicInfo: StudentAcademicInfoDto;
}
