import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string; user: any }> {
    const { email, password, firstName, lastName, phoneNumber } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName: lastName || '',
      phoneNumber,
    });

    await this.userRepository.save(user);

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const userWithoutPassword = {
      ...user,
      password: undefined,
      name: user.fullName,
      mobileNumber: user.phoneNumber,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: any }> {
    const { email, password } = loginDto;

    // Find user by email (explicitly select password field)
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'firstName',
        'lastName',
        'role',
        'isEmailVerified',
        'isActive',
      ],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password using the entity's validatePassword method
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const userWithoutPassword = {
      ...user,
      password: undefined,
      name: user.fullName,
      mobileNumber: user.phoneNumber,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      // For security, don't reveal if email exists or not
      return { message: 'If an account with this email exists, a password reset link has been sent.' };
    }

    // Generate reset token (JWT with 1 hour expiration)
    const resetToken = this.jwtService.sign(
      { email: user.email, sub: user.id, type: 'password-reset' },
      { expiresIn: '1h' }
    );

    // Create reset link (assuming frontend is on localhost:3000)
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    try {
      console.log('Sending password reset email to:', user.email);
      console.log('Reset link:', resetLink);

      // Send email
      const result = await this.mailerService.sendMail({
        to: user.email,
        subject: 'Password Reset - Community Portal',
        template: 'forgot-password',
        context: {
          email: user.email,
          resetLink,
          name: user.firstName || 'User',
        },
      });

      console.log('Email sent successfully:', result);
      return { message: 'Password reset link sent to your email' };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      // For debugging, return the error details
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  async testEmail(email: string): Promise<{ message: string }> {
    try {
      console.log('Testing email send to:', email);

      const result = await this.mailerService.sendMail({
        to: email,
        subject: 'Test Email - Community Portal',
        html: '<h1>Test Email</h1><p>This is a test email from Community Portal.</p>',
      });

      console.log('Test email sent successfully:', result);
      return { message: 'Test email sent successfully' };
    } catch (error) {
      console.error('Failed to send test email:', error);
      throw new Error(`Failed to send test email: ${error.message}`);
    }
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
