import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './entities/post/post';
import { UsersModule } from '../user/user.module';  // Import UserModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),  // Import the Post entity repository
    UsersModule,  // Import UserModule to make UserRepository available
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
