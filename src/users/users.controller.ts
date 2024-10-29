import {
  Controller,
  Get,
  Post,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Cookie } from 'src/common/decorators/cookie.decorator';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  @Post('follow/:id')
  async follow(
    @Param('id') followedID: string,
    @Cookie('accessToken') accessToken: string,
  ) {
    const followerID = this.authService.getUserIDFromToken(accessToken);
    return this.usersService.follow(followerID, followedID);
  }
  @Post('unfollow/:id')
  async unfollow(
    @Param('id') followedID: string,
    @Cookie('accessToken') accessToken: string,
  ) {
    const followerID = this.authService.getUserIDFromToken(accessToken);
    return this.usersService.unfollow(followerID, followedID);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
