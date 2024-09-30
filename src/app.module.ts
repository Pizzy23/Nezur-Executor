import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ContextModule } from './context/context.module';
import {
  RequestLoggerMiddleware,
  ConfigurationModule,
  RateLimitMiddleware,
} from './config';
import { HttpExceptionFilter } from './config/middleware/http-catcher';
import { APP_FILTER } from '@nestjs/core';
import { EntityModule } from './context/entity/entity.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    ConfigurationModule,
    AuthModule,
    ContextModule,
    EntityModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    consumer.apply(RateLimitMiddleware).forRoutes('*');
  }
}
