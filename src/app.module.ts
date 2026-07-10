import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { validation } from './config/validation';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { SkillModule } from './skill/skill.module';
import { JobModule } from './job/job.module';
import { ApplicationModule } from './application/application.module';
import authConfig from './auth/config/auth.config';
import { HttpLoggerMiddlware } from './common/logger/http-logger.middleware';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validation,
      load: [authConfig],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 6000,
        limit: 100,
      },
    ]),
    AuthModule,
    UserModule,
    CompanyModule,
    SkillModule,
    JobModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddlware).forRoutes('*');
  }
}
