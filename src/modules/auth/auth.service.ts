import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user/user';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ token: string }> {
    try {
      const { email, username, password } = registerDto;
      if (await this.usersService.findByEmail(email)) {
        throw new UnauthorizedException('Email já está em uso');
      }
      if (await this.usersService.findByUsername(username)) {
        throw new UnauthorizedException('Username já está em uso');
      }
      const user = await this.usersService.createUser(email, username, password);
      return { token: this.generateToken(user) };
    } catch (error) {
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    try {
      const { identifier, password } = loginDto;
      const user = await this.usersService.validateUser(identifier, password);
      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
      return { token: this.generateToken(user) };
    } catch (error) {
      throw new InternalServerErrorException('Login failed');
    }
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email, username: user.username };
    return this.jwtService.sign(payload);
  }
}
