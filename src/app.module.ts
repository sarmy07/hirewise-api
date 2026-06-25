import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validation,
      load: [authConfig],
    }),
    AuthModule,
    UserModule,
    CompanyModule,
    SkillModule,
    JobModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
