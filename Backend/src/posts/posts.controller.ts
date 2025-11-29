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
  Query,
  BadRequestException,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostQueryDto } from './post-query.dto';

interface AuthenticatedRequest extends Request {
  user: { id: string; username: string };
}

@Controller('posts')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(@Query() query: PostQueryDto) {
    try {
      return await this.postsService.findAll(query);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to fetch posts',
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const post = await this.postsService.findOne(id);
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      return post;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid post ID',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      return await this.postsService.create({
        ...createPostDto,
        authorId: req.user.id,
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to create post',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: AuthenticatedRequest,
  ) {
    try {
      // Verify post exists and user is the author
      const post = await this.postsService.findOne(id);
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      if (post.authorId !== req.user.id) {
        throw new BadRequestException('Not authorized to update this post');
      }

      return await this.postsService.update(id, updatePostDto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update post');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    try {
      // Verify post exists and user is the author
      const post = await this.postsService.findOne(id);
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      if (post.authorId !== req.user.id) {
        throw new BadRequestException('Not authorized to delete this post');
      }

      await this.postsService.remove(id);
      return { message: 'Post deleted successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to delete post');
    }
  }
}
