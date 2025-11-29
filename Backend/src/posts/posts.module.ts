import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';
import { Post } from './post.entity.js';
import { File } from '../files/file.entity.js';
import { FilesModule } from '../files/files.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, File]),
    MulterModule.register({
      dest: './uploads',
    }),
    FilesModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
