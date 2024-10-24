import { Injectable } from '@nestjs/common';
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

  update(id: number, updatePostDto: UpdatePostDto) {
    return this.postRepository.update(id, updatePostDto);
  }

  remove(id: number) {
    return this.postRepository.delete(id);
  }
}
