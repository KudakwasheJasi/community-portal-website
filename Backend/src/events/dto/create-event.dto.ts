import { IsString, IsOptional, IsDateString, IsNumber, Min, IsUrl } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAttendees?: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}