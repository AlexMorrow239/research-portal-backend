import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TestService, Test } from './test.service';

@ApiTags('test')
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a test entry' })
  @ApiResponse({ status: 201, description: 'Test entry successfully created' })
  async createTest(@Body() body: { name: string }): Promise<Test> {
    return this.testService.createTest(body.name);
  }
}