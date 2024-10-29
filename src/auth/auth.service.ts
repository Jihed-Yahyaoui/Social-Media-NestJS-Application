import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupUserDto } from 'src/users/dto/signup-user.dto';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';

type cookies = { accessToken: string; refreshToken: string };

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // This method creates an accessToken and a refreshToken
  async jwtSign(userID: string, email: string): Promise<cookies> {
    const accessToken = await this.jwtService.signAsync(
      { userID, email },
      { secret: 'accesstoken', expiresIn: '30m' },
    );
    const refreshToken = await this.jwtService.signAsync(
      { userID, email },
      { secret: 'refreshToken', expiresIn: '7d' },
    );
    return { accessToken, refreshToken };
  }

  getUserIDFromToken(accessToken: string) {
    const { userID } = this.jwtService.decode<{
      userID: string;
    }>(accessToken);
    return userID;
  }

  async signup(signupUserDto: SignupUserDto): Promise<cookies> {
    // Verify if email exists
    const duplicateUser = await this.usersRepository.findOneBy({
      email: signupUserDto.email,
    });

    if (duplicateUser)
      throw new ForbiddenException('This email already exists!');

    // Create user and cookies
    const { userID, email } = await this.usersRepository.save({
      ...signupUserDto,
      comments: [],
      experiences: [],
      posts: [],
      likes: [],
      followers: [],
      following: [],
    });

    return await this.jwtSign(userID, email);
  }

  async signin(signinUserDTO: SigninUserDto): Promise<cookies> {
    // Find user and create cookies
    const { userID, email } = await this.usersRepository.findOne({
      where: signinUserDTO,
    });
    if (email && userID) return await this.jwtSign(userID, email);
    throw new NotFoundException('The email or password are incorrect.');
  }

  async signout(): Promise<void> {}
}
