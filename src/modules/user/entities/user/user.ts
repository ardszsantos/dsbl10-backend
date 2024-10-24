import { Post } from '../../../post/entities/post/post';
import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';

@Entity()
@Unique(['email'])
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
