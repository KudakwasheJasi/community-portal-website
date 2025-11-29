import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PostsService } from './posts.service.ts';
import { PostsController } from './posts.controller.ts';
import { Post } from './post.entity.ts';

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
