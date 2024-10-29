import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Image } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) {}

  async create(createImageDto: CreateImageDto, post: Post) {
    const imageEntities: Array<Image> = [];

    // Loop through images and add them to DB
    Promise.all(
      createImageDto.images.map((image) =>
        this.imagesRepository
          .save({ post, data: image })
          .then((imageEntity) => imageEntities.push(imageEntity)),
      ),
    );

    // Return the created image entities
    return imageEntities;
  }

  findAll() {
    return `This action returns all images`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
