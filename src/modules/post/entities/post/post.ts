import { Notification } from '../../../notifications/entities/notification/notification';
import { Comment } from '../../../comments/entities/comment/comment';
import { User } from '../../../user/entities/user/user';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'longtext' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { eager: false })
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  // New relationship to notifications
  @OneToMany(() => Notification, (notification) => notification.post)
  notifications: Notification[];
}
