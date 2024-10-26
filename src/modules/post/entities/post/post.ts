import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../../user/entities/user/user';
import { OneToMany } from 'typeorm';
import { Comment } from '../../../comments/entities/comment/comment';


@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'longtext' })  // Changed from 'text' to 'longtext' for MySQL
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.posts, { eager: false })
    author: User;

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];
}
