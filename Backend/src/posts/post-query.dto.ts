// backend/src/posts/dto/post-query.dto.ts
import { IsOptional, IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { PostStatus, PostVisibility } from './post.entity';
import { Transform, Type } from 'class-transformer';

export class PostQueryDto {
  // Pagination
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  // Search and filter
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsEnum(PostVisibility)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  visibility?: PostVisibility[];

  // Relationships
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  tagId?: string;

  // Sorting
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC')
  order?: 'ASC' | 'DESC' = 'DESC';

  // Include relations
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeAuthor?: boolean = true;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeCategories?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeTags?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeComments?: boolean = false;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  includeLikes?: boolean = false;
}
