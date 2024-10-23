import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving all users');
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by email');
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    try {
      return await this.usersRepository.findOne({ where: { username } });
    } catch (error) {
      throw new InternalServerErrorException('Error finding user by username');
    }
  }

  async createUser(email: string, username: string, password: string): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.usersRepository.create({
        email,
        username,
        password: hashedPassword,
      });
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async validateUser(identifier: string, password: string): Promise<User | null> {
    try {
      let user: User | undefined = this.isEmail(identifier) ? await this.findByEmail(identifier) : await this.findByUsername(identifier);
      if (user && await bcrypt.compare(password, user.password)) {
        return user;
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException('Error validating user');
    }
  }

  private isEmail(identifier: string): boolean {
    return /\S+@\S+\.\S+/.test(identifier);
  }
}
