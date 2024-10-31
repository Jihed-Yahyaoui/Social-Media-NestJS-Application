import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Cookie } from 'src/common/decorators/cookie.decorator';
import { AuthService } from 'src/auth/auth.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private authService: AuthService,
  ) {}

  @Post(':id')
  create(
    @Cookie('accessToken') accessToken: string,
    @Body() createCommentDto: CreateCommentDto,
    @Param('id') postID: string,
  ) {
    const userID = this.authService.getUserIDFromToken(accessToken);
    return this.commentsService.create(userID, postID, createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
