import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './modules/post/post.module';
import { CommentsModule } from './modules/comments/comments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Allows the use of environment variables globally
    }),
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig, // Uses the config function from database.config.ts
    }),
    AuthModule,
    UsersModule,
    PostModule,
    CommentsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
