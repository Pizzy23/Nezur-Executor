import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateManipulator } from '../../util/date'
@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();
    const start = process.hrtime();
    const date = new DateManipulator()
    return next.handle().pipe(
      map((data) => {
        const end = process.hrtime(start);
        const timeRequest = (end[0] + end[1] / 1e9).toFixed(3);
        return {
          statusCode: data.status,
          path: request.url,
          timeRequest:`${timeRequest} MS`,
          timestamp: date.YMDHMS(),
          res: {
            data: data.res,
          },
        };
      }),
    );
  }
}
