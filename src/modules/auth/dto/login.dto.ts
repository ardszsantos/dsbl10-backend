// src/auth/dto/login.dto.ts
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  identifier: string; // Pode ser email ou username

  @IsNotEmpty()
  password: string;
}
