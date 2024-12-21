import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TestService, Test } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a test entry' })
  @ApiResponse({ status: 201, description: 'Test entry successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createTest(@Body() createTestDto: CreateTestDto): Promise<Test> {
    return this.testService.createTest(createTestDto.name);
  }
}