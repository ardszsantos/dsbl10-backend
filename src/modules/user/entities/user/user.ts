import { Notification } from '../../../notifications/entities/notification/notification';
import { Post } from '../../../post/entities/post/post';
import { Comment } from '../../../comments/entities/comment/comment';
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

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];
}
