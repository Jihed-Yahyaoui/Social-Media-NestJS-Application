import { IsArray, IsString } from 'class-validator';

export class CreateImageDto {
  @IsArray()
  @IsString({ each: true })
  images: string[];
}
