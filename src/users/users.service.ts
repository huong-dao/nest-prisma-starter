import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto, UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    // 1. Kiểm tra email trùng
    const userExists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (userExists) throw new ConflictException('Email đã tồn tại');

    // 2. Hash mật khẩu
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // 3. Lưu User
    const user = await this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
    });

    // Bóc tách lấy password ra riêng, các phần còn lại vào biến result
    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, fullName: true, role: true, isActive: true }
    });
  }

  // 1. Dành cho người dùng tự cập nhật chính mình
  async updateProfile(id: number, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    if (dto.password) {
      const salt = await bcrypt.genSalt();
      dto.password = await bcrypt.hash(dto.password, salt);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    const { password, ...result } = updated;
    return result;
  }

  // 2. Dành cho Admin cập nhật Role/Trạng thái của bất kỳ ai
  async adminUpdateUser(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    const { password, ...result } = updated;
    return result;
  }
}