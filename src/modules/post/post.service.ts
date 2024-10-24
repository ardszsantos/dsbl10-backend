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

    @InjectRepository(User)  // Add UserRepository to fetch user
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    // Fetch the user based on userId
    const author = await this.userRepository.findOne({ where: { id: userId } });

    if (!author) {
      throw new Error('User not found');  // Handle the case where the user is not found
    }

    // Create the new post and set the author
    const post = this.postRepository.create({
      ...createPostDto,
      author,  // Associate the post with the author
    });

    // Save the post to the database
    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find({
      relations: ['author'],  // Include the author (user) relationship
    });
  }

  findOne(id: number) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['author'],  // Ensure the author is loaded
    });
  }

  // Updated update method with ownership check
  async update(id: number, updatePostDto: UpdatePostDto, userId: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],  // Load the author to check ownership
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    // Check if the current user is the author of the post
    if (post.author.id !== userId) {
      throw new ForbiddenException("You are not allowed to edit this post");
    }

    // Update the post with new data
    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);  // Save the updated post
  }

  // Updated remove method with ownership check
  async remove(id: number, userId: number): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],  // Load the author to check ownership
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    // Check if the current user is the author of the post
    if (post.author.id !== userId) {
      throw new ForbiddenException("You are not allowed to delete this post");
    }

    // Proceed with deletion if the user is the author
    await this.postRepository.remove(post);
  }
}
