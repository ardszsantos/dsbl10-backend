import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post/post';
import { CreatePostDto } from './dto/create-post.dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto/update-post.dto';
import { User } from '../user/entities/user/user';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Functionality to reset the posts table
  async resetPostsTable(): Promise<string> {
    await this.postRepository.clear();
    return 'Posts table has been reset.';
  }

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const author = await this.userRepository.findOne({ where: { id: userId } });
    if (!author) throw new Error('User not found');

    const post = this.postRepository.create({
      ...createPostDto,
      author,
    });
    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find({ relations: ['author'] });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException(`Post with id ${id} not found`);
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number): Promise<Post> {
    const post = await this.findOne(id);
    if (post.author.id !== userId) throw new ForbiddenException("You are not allowed to edit this post");

    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }

  async remove(id: number, userId: number): Promise<void> {
    const post = await this.findOne(id);
    if (post.author.id !== userId) throw new ForbiddenException("You are not allowed to delete this post");

    await this.postRepository.remove(post);
  }

}
