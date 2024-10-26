import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Post } from '../../../post/entities/post/post';
  import { User } from '../../../user/entities/user/user';
  
  @Entity()
  export class Comment {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column('text')
    content: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    // Relationships
    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    post: Post;
  
    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    user: User;
  }
  