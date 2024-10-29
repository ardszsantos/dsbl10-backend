import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../../user/entities/user/user';
import { Post } from '../../../post/entities/post/post';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships to User and Post
  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, (post) => post.notifications, { onDelete: 'CASCADE' })
  post: Post;
}
