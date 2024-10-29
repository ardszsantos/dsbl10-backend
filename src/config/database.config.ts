import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Comment } from 'src/modules/comments/entities/comment/comment';
import { Notification } from 'src/modules/notifications/entities/notification/notification';
import { Post } from 'src/modules/post/entities/post/post';
import { User } from 'src/modules/user/entities/user/user';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Post, Comment, Notification],
    synchronize: true, // Set to false in production
    ssl: {
      ca: process.env.DB_CA_CERT,
    },
  };
};
