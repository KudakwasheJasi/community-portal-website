import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto.ts';
import { UpdateCommentDto } from './dto/update-comment.dto.ts';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    return await this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentRepository.find({
      relations: ['author', 'post', 'parent'],
      order: { createdAt: 'ASC' },
    });
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['author', 'replies', 'replies.author'],
      order: { createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'post', 'parent', 'replies'],
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne(id);
    Object.assign(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async remove(id: string): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentRepository.remove(comment);
  }

  async findReplies(parentId: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { parent: { id: parentId } },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }
}
