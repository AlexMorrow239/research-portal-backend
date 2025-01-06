import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorHandlingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Log unexpected errors
        if (!error.status || error.status === 500) {
          this.logger.error('Unexpected error occurred', {
            error: error.message,
            stack: error.stack,
          });

          // In production, don't expose internal error details
          if (process.env.NODE_ENV === 'production') {
            error = new InternalServerErrorException('An unexpected error occurred');
          }
        }

        return throwError(() => error);
      }),
    );
  }
}
