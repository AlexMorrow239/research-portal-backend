import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LoginResponseDto } from '@/common/dto/auth/login-response.dto';
import { loginExamples } from '@/common/swagger';
import { AuthDescriptions } from '@/common/swagger/descriptions/auth.description';

import { AuthService } from './auth.service';
import { LoginDto } from '../../common/dto/auth/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation(AuthDescriptions.login)
  @ApiBody({
    type: LoginDto,
    examples: loginExamples,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully logged in',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }
}
