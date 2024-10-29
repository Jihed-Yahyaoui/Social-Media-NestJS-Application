import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import postType from '../types/post-types';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsIn(['post', 'question', 'idea'])
  type: postType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
