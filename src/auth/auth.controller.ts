import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() forgotPasswordDto:{email:string}) {
    try {
      await this.authService.forgotPassword(forgotPasswordDto.email);
      return { message: 'Password reset instructions have been sent to your email' };
    } catch (error) {
      throw new BadRequestException('Error handling password reset request');
    }
  }

  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto:{token:string, newPassword:string}) {
    try {
      await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
      return { message: 'Password has been reset successfully' };
    } catch (error) {
      throw new BadRequestException('Error resetting password');
    }
  }
}
