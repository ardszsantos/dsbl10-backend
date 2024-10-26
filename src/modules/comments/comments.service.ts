// src/modules/comments/comments.service.ts
import {
    Injectable,
    NotFoundException,
    ForbiddenException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  // Import entities
  import { Comment } from './entities/comment/comment';
  import { Post } from '../post/entities/post/post';
  import { CreateCommentDto } from './dto/create-comment.dto/create-comment.dto';
  
  @Injectable()
  export class CommentsService {
    constructor(
      @InjectRepository(Comment)
      private readonly commentsRepository: Repository<Comment>,
      @InjectRepository(Post)
      private readonly postRepository: Repository<Post>,
    ) {}
  
    // Create a new comment
    async create(createCommentDto: CreateCommentDto, userId: number): Promise<Comment> {
      const { content, postId } = createCommentDto;
  
      // Find the post to associate with the comment
      const post = await this.postRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new NotFoundException(`Post with id ${postId} not found`);
      }
  
      // Create and save the comment
      const comment = this.commentsRepository.create({
        content,
        post,
        user: { id: userId }, // Associate the comment with the user
      });
  
      return this.commentsRepository.save(comment);
    }
  
    // Delete a comment
    async delete(commentId: number, userId: number): Promise<void> {
      const comment = await this.commentsRepository.findOne({
        where: { id: commentId },
        relations: ['user'],
      });
  
      if (!comment) {
        throw new NotFoundException(`Comment with id ${commentId} not found`);
      }
  
      // Check if the comment belongs to the user
      if (comment.user.id !== userId) {
        throw new ForbiddenException('You are not allowed to delete this comment');
      }
  
      await this.commentsRepository.remove(comment);
    }
  
    // (Optional) Get comments for a post
    async findByPost(postId: number): Promise<Comment[]> {
      return this.commentsRepository.find({
        where: { post: { id: postId } },
        relations: ['user'],
      });
    }
  }
  