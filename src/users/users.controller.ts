import { Controller, Get, Post, Body, Patch, Request, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto, UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // Route: PATCH /users/profile (Người dùng tự gọi)
  // Sau này thêm @UseGuards(JwtAuthGuard) ở đây
  @Patch('profile')
  updateMe(@Request() req: any, @Body() dto: UpdateProfileDto) {
    // Lấy ID từ Token của người đang đăng nhập (req.user.id)
    const userId = req.user.id; 
    return this.usersService.updateProfile(userId, dto);
  }

  // Route: PATCH /users/:id/admin (Chỉ Admin mới được gọi)
  // Sau này thêm @Roles(Role.ADMIN) @UseGuards(RolesGuard) ở đây
  @Patch(':id/admin')
  adminUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.adminUpdateUser(id, dto);
  }
}