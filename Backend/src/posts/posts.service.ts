import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findByAuthor(authorId: string): Promise<Post[]> {
    return this.postRepository.find({
      where: { authorId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(createPostData: Partial<Post>): Promise<Post> {
    const post = this.postRepository.create(createPostData);
    return this.postRepository.save(post);
  }

  async update(id: string, updateData: Partial<Post>): Promise<Post> {
    const post = await this.findOne(id);

    Object.assign(post, updateData);
    await this.postRepository.save(post);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
  }
}
