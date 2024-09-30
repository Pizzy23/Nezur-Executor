import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private limiter = new RateLimiterMemory({
    points: 10,
    duration: 60,
  });

  async use(req: Request, res: Response, next: NextFunction) {
    const clientIp = req.ip;

    try {
      await this.limiter.consume(clientIp);
      next();
    } catch (error) {
      throw new HttpException(
        'Too Many Requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
