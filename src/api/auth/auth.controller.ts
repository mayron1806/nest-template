import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from 'src/guard/local.guard';
import { CreateUserRequest } from './dto/request/create-user-request';
import { ResetPasswordRequest } from './dto/request/reset-password-request';
import { RefreshTokenRequest } from './dto/request/refresh-token-request';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('create')
  @HttpCode(201)
  async create(@Body() createAuthDto: CreateUserRequest) {
    return await this.authService.createAccount(createAuthDto);
  }

  @Post('active/:id')
  async activeAccount(@Param('id') id: string) {
    console.log(id);
    
    return this.authService.activeAccount(id);
  }
  @Post('refresh-token')
  async getRefreshToken(@Body() request: RefreshTokenRequest) {
    return await this.authService.refreshToken(request);
  }

  @UseGuards(LocalGuard)
  @HttpCode(200)
  @Post('login')
  login(@Req() req) {
    const res = this.authService.login(req.user.id);
    console.log(res);
    return res;
  }
  @Put('reset-password')
  async sendEmailResetPassword(@Body() data: ResetPasswordRequest) {
    return await this.authService.resetPassword({
      email: data.email,
      type: 'sendEmail',
    });
  }

  @Put('reset-password/:id')
  async resetPassword(
    @Param('id') id: string,
    @Body() data: ResetPasswordRequest,
  ) {
    return await this.authService.resetPassword(
      {
        password: data.password,
        confirmPassword: data.confirmPassword,
        type: 'resetPassword',
      },
      id,
    );
  }
}
