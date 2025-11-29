import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto.ts';
import { IsString, Length } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsString()
  @Length(1, 1000)
  content?: string;
}
