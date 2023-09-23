import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import * as moment from 'moment';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = moment().toDate();
    const req = context.switchToHttp().getRequest() as Request;
    const route = req.url;
    console.log(`Iniciando nova requisicao: ${route}`);
    return next.handle().pipe(
      tap(() => {
        const time = moment().diff(moment(start), 'milliseconds');
        const message = `Duração da request: ${time} ms`;
        console.log(message);
      }),
    );
  }
}
