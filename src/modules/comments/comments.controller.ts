// src/modules/comments/comments.controller.ts
import {
    Controller,
    Post,
    Body,
    Delete,
    Param,
    UseGuards,
    Req,
    Get,
    ParseIntPipe,
  } from '@nestjs/common';
  import { CommentsService } from './comments.service';
  import { CreateCommentDto } from './dto/create-comment.dto/create-comment.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { AuthenticatedRequest } from 'src/types/express-request.interface';
  import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
  } from '@nestjs/swagger';
  
  @ApiTags('comments')
  @ApiBearerAuth()
  @Controller('comments')
  export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}
  
    // Create a new comment
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create a new comment' })
    @ApiResponse({ status: 201, description: 'Comment created successfully.' })
    async create(
      @Body() createCommentDto: CreateCommentDto,
      @Req() req: AuthenticatedRequest,
    ) {
      const userId = req.user.id;
      return this.commentsService.create(createCommentDto, userId);
    }
  
    // Delete a comment
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a comment' })
    @ApiResponse({ status: 200, description: 'Comment deleted successfully.' })
    async delete(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: AuthenticatedRequest,
    ) {
      const userId = req.user.id;
      await this.commentsService.delete(id, userId);
      return { message: 'Comment deleted successfully' };
    }
  
    // (Optional) Get comments for a specific post
    @Get('post/:postId')
    @ApiOperation({ summary: 'Get comments for a post' })
    @ApiResponse({
      status: 200,
      description: 'List of comments for the post.',
      isArray: true,
    })
    async getCommentsByPost(@Param('postId', ParseIntPipe) postId: number) {
      return this.commentsService.findByPost(postId);
    }
  }
  