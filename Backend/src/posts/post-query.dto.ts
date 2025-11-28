// backend/src/posts/dto/post-query.dto.ts
import { IsOptional, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { PostStatus, PostVisibility } from './post.entity';
import { Transform } from 'class-transformer';

export class PostQueryDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PostStatus, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  status?: PostStatus[];

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  tags?: string[];

  @IsOptional()
  @IsUUID(undefined, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  categories?: string[];

  @IsOptional()
  @IsEnum(PostVisibility, { each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  visibility?: PostVisibility[];

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC' = 'DESC';
}