import { Controller, Get, Post, Body, Param, Delete, Patch, Req, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/types/express-request.interface';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Delete('reset')
  @ApiOperation({ summary: 'Reset the posts table' })
  @ApiResponse({ status: 200, description: 'Posts table has been reset.' })
  resetPosts() {
    return this.postService.resetPostsTable();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.postService.create(createPostDto, userId);
  }

  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.postService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: AuthenticatedRequest
  ) {
    const userId = req.user.id;
    return this.postService.update(id, updatePostDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.postService.remove(id, userId);
  }
}

