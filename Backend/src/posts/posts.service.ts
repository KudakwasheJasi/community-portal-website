import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like as TypeOrmLike, FindManyOptions } from 'typeorm';
import { Post, PostStatus } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQueryDto } from './post-query.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll(query: PostQueryDto) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        visibility,
        authorId,
      } = query;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (status) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        where.status = status;
      }
      if (visibility) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        where.visibility = visibility;
      }
      if (authorId) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        where.authorId = authorId;
      }

      if (search) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        where.title = TypeOrmLike(`%${search}%`);
      }

      const options: FindManyOptions<Post> = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where,
        relations: ['author'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      };

      const [items, total] = await this.postRepository.findAndCount(options);

      return {
        items,
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch {
      throw new BadRequestException('Failed to fetch posts');
    }
  }

  async findOne(id: string): Promise<Post> {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['author', 'comments'],
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // Increment view count
      post.viewCount += 1;
      await this.postRepository.save(post);

      return post;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Invalid post ID');
    }
  }

  async create(
    createPostDto: CreatePostDto & { authorId: string },
    file?: any,
  ): Promise<Post> {
    try {
      console.log('Creating post with data:', createPostDto);
      console.log('File:', file);

      const { authorId, ...postData } = createPostDto;

      // Generate slug if not provided
      const slug = postData.slug || this.generateSlug(postData.title);
      console.log('Generated slug:', slug);

      const postDataWithAuthor = {
        ...postData,
        slug,
        author: { id: authorId },
      };

      // Convert string status to enum
      if (postData.status) {
        const statusValue = postData.status.toLowerCase() === 'published' ? PostStatus.PUBLISHED :
                           postData.status.toLowerCase() === 'draft' ? PostStatus.DRAFT :
                           postData.status.toLowerCase() === 'archived' ? PostStatus.ARCHIVED :
                           PostStatus.DRAFT;
        postDataWithAuthor.status = statusValue;
      }

      if (postDataWithAuthor.status === PostStatus.PUBLISHED) {
        postDataWithAuthor['publishedAt'] = new Date();
      }

      // Handle file upload if provided
      if (file) {
        postDataWithAuthor['featuredImage'] = `/uploads/${file.filename}`;
        console.log('Set featuredImage:', postDataWithAuthor['featuredImage']);
      }

      console.log('Final post data:', postDataWithAuthor);

      const post = this.postRepository.create(postDataWithAuthor as Partial<Post>);
      const savedPost = await this.postRepository.save(post);

      console.log('Post saved successfully:', savedPost.id);
      return savedPost;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new BadRequestException('Failed to create post');
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }

  async update(id: string, updatePostDto: UpdatePostDto, file?: any): Promise<Post> {
    try {
      const post = await this.findOne(id);

      // Handle file upload if provided
      if (file) {
        updatePostDto.featuredImage = `/uploads/${file.filename}`;
      }

      // Convert string status to enum if provided
      if (updatePostDto.status) {
        const statusValue = updatePostDto.status.toLowerCase() === 'published' ? PostStatus.PUBLISHED :
                           updatePostDto.status.toLowerCase() === 'draft' ? PostStatus.DRAFT :
                           updatePostDto.status.toLowerCase() === 'archived' ? PostStatus.ARCHIVED :
                           post.status; // Keep existing status if invalid
        updatePostDto.status = statusValue;
      }

      // Update status timestamp if status changed to PUBLISHED
      if (
        updatePostDto.status === PostStatus.PUBLISHED &&
        post.status !== PostStatus.PUBLISHED
      ) {
        post.publishedAt = new Date();
      }

      Object.assign(post, updatePostDto);
      return await this.postRepository.save(post);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to update post');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const post = await this.findOne(id);

      // Delete associated file if exists
      // if (post.featuredImage) {
      //   await this.fileService.deleteFile(post.featuredImage);
      // }

      await this.postRepository.remove(post);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to delete post');
    }
  }

  // Additional helper methods
  async incrementLikeCount(postId: string): Promise<void> {
    await this.postRepository.increment({ id: postId }, 'likeCount', 1);
  }

  async decrementLikeCount(postId: string): Promise<void> {
    await this.postRepository.decrement({ id: postId }, 'likeCount', 1);
  }

  async updateCommentCount(postId: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['comments'],
    });

    if (post) {
      post.commentCount = post.comments?.length || 0;
      await this.postRepository.save(post);
    }
  }
}
