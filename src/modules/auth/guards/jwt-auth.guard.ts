import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Protects routes requiring JWT authentication
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
