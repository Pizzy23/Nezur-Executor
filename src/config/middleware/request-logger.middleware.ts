import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        }),
      ),
      transports: [new winston.transports.File({ filename: 'log.txt' })],
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const logMessage = `Request: ${method} - ${originalUrl} from ${ip}, Status Code: ${statusCode}`;
      console.log(logMessage);
      if (statusCode !== 500) {
        this.logger.info(logMessage);
      } else {
        this.logger.error(logMessage);
      }
    });

    next();
  }
}
