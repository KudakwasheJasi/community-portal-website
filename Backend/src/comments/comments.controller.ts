import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../users/user.entity';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findAll() {
    return await this.commentsService.findAll();
  }

  @Get('posts/:postId')
  async getPostComments(@Param('postId') postId: string) {
    return await this.commentsService.findByPost(postId);
  }

  @Get('replies/:commentId')
  async getCommentReplies(@Param('commentId') commentId: string) {
    return await this.commentsService.findReplies(commentId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commentsService.findOne(id);
  }

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: { user: User },
  ) {
    const authorId = req.user.id;
    return await this.commentsService.create({ ...createCommentDto, authorId });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    // TODO: Add authorization check to ensure user can only update their own comments
    return await this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // TODO: Add authorization check to ensure user can only delete their own comments or admin can delete any
    return await this.commentsService.remove(id);
  }
}
