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
        where.status = status;
      }
      if (visibility) {
        where.visibility = visibility;
      }
      if (authorId) where.authorId = authorId;

      if (search) {
        where.title = TypeOrmLike(`%${search}%`);
      }

      const options: FindManyOptions<Post> = {
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
    } catch (error) {
      throw new BadRequestException('Failed to fetch posts');
    }
  }

  async findOne(id: string): Promise<Post> {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
        relations: ['author', 'categories', 'tags', 'comments', 'likes'],
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

  async create(createPostDto: CreatePostDto & { authorId: string }): Promise<Post> {
    try {
      const { authorId, ...postData } = createPostDto;

      const postDataWithAuthor = {
        ...postData,
        author: { id: authorId }
      };

      if (postData.status && postData.status === PostStatus.PUBLISHED) {
        postDataWithAuthor['publishedAt'] = new Date();
      }

      const post = this.postRepository.create(postDataWithAuthor);

      return await this.postRepository.save(post);
    } catch (error) {
      throw new BadRequestException('Failed to create post');
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    try {
      const updateData = updatePostDto;
      const post = await this.findOne(id);

      // Create a new object for the updated data with proper typing
      const updatedData: Partial<Post> = { ...updateData };

      // Update status timestamp if status changed to PUBLISHED
      if (updateData.status === PostStatus.PUBLISHED && post.status !== PostStatus.PUBLISHED) {
        updatedData.publishedAt = new Date();
      }

      Object.assign(post, updatedData);
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
