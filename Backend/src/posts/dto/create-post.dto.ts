// backend/src/posts/dto/create-post.dto.ts
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { PostVisibility } from '../post.entity';

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

  @IsString()
  @IsOptional()
  imageUrl?: string;

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
