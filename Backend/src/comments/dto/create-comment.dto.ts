import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsUUID()
  postId: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsUUID()
  authorId: string;
}
