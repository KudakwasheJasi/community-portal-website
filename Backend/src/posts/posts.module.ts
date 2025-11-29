import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PostsService } from './posts.service.ts';
import { PostsController } from './posts.controller.ts';
import { Post } from './post.entity.ts';
import { File } from '../files/file.entity.ts';
import { FilesModule } from '../files/files.module.ts';

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
