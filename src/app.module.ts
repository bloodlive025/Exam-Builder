import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';


@Module({
  imports: [ConfigModule.forRoot({isGlobal: true,envFilePath: '.env'}), 
    MongooseModule.forRoot(process.env.MONGODB_URI!), UsersModule,AuthModule ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements  NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
