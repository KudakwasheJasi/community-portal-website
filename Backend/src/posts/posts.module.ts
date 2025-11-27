import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';
import { Post } from './post.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
