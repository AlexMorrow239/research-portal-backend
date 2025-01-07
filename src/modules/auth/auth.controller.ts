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
    description: AuthDescriptions.responses.loginSuccess,
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: AuthDescriptions.responses.invalidCredentials,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: AuthDescriptions.responses.inactiveAccount,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: AuthDescriptions.responses.invalidEmailDomain,
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: AuthDescriptions.responses.tooManyAttempts,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: AuthDescriptions.responses.serverError,
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }
}
