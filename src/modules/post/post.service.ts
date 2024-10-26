@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.postRepository.findAndCount({
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      posts,
      totalPages,
      currentPage: page,
    };
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

