
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';
@Injectable()
export class AuthService {
  private transporter: {
    sendMail: (arg0: {
      from: string; to: string;
      subject: string; text: string;
    }) => any;
  }
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private userService: UsersService,
    private jwtService: JwtService,
    
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // or any other email service
      auth: {
        user: 'rushikeshsobale@gmail.com', // Your email username  
        pass: 'bhzw yovd ugah jzol', // Your email password
      },
    });
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
      subscription: {
        planType: user.subscription?.planType || null,
        startDate: user.subscription?.startDate || null,
        endDate: user.subscription?.endDate || null,
        isActive: user.subscription?.isActive || false,
        referralCode: user.subscription?.referralCode || null,
      },
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = this.jwtService.sign({ email: user.email }, { expiresIn: '1h' });
    // Generate a secure token
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
    const content = `
  Hi ${user.username},

  We received a request to reset your password for your account associated with this email address. 
  If you made this request, please click on the link below to reset your password:

  ${process.env.FRONTEND_URL}auth/resetPassword?token=${resetToken}

  This link will expire in 1 hour. If you did not request a password reset, please ignore this email or contact support if you have concerns.

  Thank you,
  The Support Team
`;

   const userd =  await user.save();
   console.log(userd, 'userd')
    await this.transporter.sendMail({
      from: 'rushikeshsobale@gmaail.com',
      to: user.email,
      subject: 'Subscription Purchased',
      text: content
    });
  }

  async resetPassword(token: string, newPassword: string) {
    const payload = this.jwtService.verify(token);
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      
      throw new BadRequestException('Invalid token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }
 
}

