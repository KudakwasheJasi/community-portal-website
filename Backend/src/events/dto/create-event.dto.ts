import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAttendees?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
