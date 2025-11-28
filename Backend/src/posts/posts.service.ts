import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like as TypeOrmLike, FindManyOptions } from 'typeorm';
import { Post, PostStatus, PostVisibility } from './post.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQueryDto } from './post-query.dto';
import { File } from '../files/file.entity';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { FileType } from '../files/file.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  private async saveUploadedFile(file: Express.Multer.File, userId: string): Promise<string> {
    const uploadDir = join(__dirname, '..', 'uploads');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Save file to disk
    const fs = require('fs');
    fs.writeFileSync(filePath, file.buffer);

    return fileName;
  }

  async findAll(query: PostQueryDto) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search, 
        status, 
        visibility,
        authorId,
        categoryId,
        tagId,
      } = query;

      const skip = (page - 1) * limit;
      const where: any = {};

      if (status) where.status = status;
      if (visibility) where.visibility = visibility;
      if (authorId) where.authorId = authorId;
      
      if (search) {
        where.title = TypeOrmLike(`%${search}%`);
      }

      const options: FindManyOptions<Post> = {
        where,
        relations: ['author', 'categories', 'tags'],
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      };

      // Initialize relations array if not exists
      if (!options.relations) {
        options.relations = [];
      }
      
      if (categoryId) {
        if (Array.isArray(options.relations)) {
          options.relations.push('categories');
        } else {
          options.relations.categories = true;
        }
        where.categories = { id: categoryId };
      }

      if (tagId) {
        if (Array.isArray(options.relations)) {
          options.relations.push('tags');
        } else {
          options.relations.tags = true;
        }
        where.tags = { id: tagId };
      }

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

  async create(createPostDto: CreatePostDto & { authorId: string; file?: Express.Multer.File }): Promise<Post> {
    try {
      const { authorId, file, ...postData } = createPostDto;
      
      const postDataWithAuthor = {
        ...postData,
        author: { id: authorId }
      };
      
      if (postData.status === PostStatus.PUBLISHED) {
        postDataWithAuthor['publishedAt'] = new Date();
      }
      
      const post = this.postRepository.create(postDataWithAuthor);

      if (file) {
        const fileName = await this.saveUploadedFile(file, authorId);
        postDataWithAuthor.featuredImage = `/uploads/${fileName}`;
      }

      return await this.postRepository.save(post);
    } catch (error) {
      throw new BadRequestException('Failed to create post');
    }
  }

  async update(id: string, updatePostDto: UpdatePostDto & { file?: Express.Multer.File }): Promise<Post> {
    try {
      const { file, ...updateData } = updatePostDto;
      const post = await this.findOne(id);

      // Create a new object for the updated data with proper typing
      const updatedData: Partial<Post> = { ...updateData };

      // Handle file upload if a new file is provided
      if (file) {
        const fileName = await this.saveUploadedFile(file, post.authorId);
        updatedData.featuredImage = `/uploads/${fileName}`;
      }

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
