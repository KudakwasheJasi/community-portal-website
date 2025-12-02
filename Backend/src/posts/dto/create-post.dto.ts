// backend/src/posts/dto/create-post.dto.ts
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
import { PostStatus, PostVisibility } from '../post.entity';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  status?: string = 'draft';

  @IsEnum(PostVisibility)
  @IsOptional()
  visibility?: PostVisibility = PostVisibility.PUBLIC;

  @IsUrl()
  @IsOptional()
  featuredImage?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagNames?: string[] = [];

  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  categoryIds?: string[] = [];
}
