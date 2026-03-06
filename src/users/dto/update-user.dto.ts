import { IsString, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateProfileDto {
    @IsString()
    @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    fullName?: string;
}

export class UpdateUserDto {
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
  
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}