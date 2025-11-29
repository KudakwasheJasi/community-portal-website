import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      };

      const mockUser = {
        id: '1',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(userRepository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: expect.any(String), // hashed password
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phoneNumber: undefined,
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          ...mockUser,
          password: undefined,
          name: undefined,
          mobileNumber: undefined,
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User',
      };

      mockUserRepository.findOne.mockResolvedValue({ id: '1', email: registerDto.email });

      await expect(service.register(registerDto)).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '1',
        email: loginDto.email,
        password: await bcrypt.hash(loginDto.password, 10),
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        isEmailVerified: true,
        isActive: true,
        validatePassword: jest.fn().mockResolvedValue(true),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
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
      expect(mockUser.validatePassword).toHaveBeenCalledWith(loginDto.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          ...mockUser,
          password: undefined,
          name: undefined,
          mobileNumber: undefined,
        },
      });
    });

  it('should throw UnauthorizedException if user not found', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: '1',
        email: loginDto.email,
        password: await bcrypt.hash('correctpassword', 10),
        validatePassword: jest.fn().mockResolvedValue(false),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.validateUser('1');

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.validateUser('1')).rejects.toThrow('User not found');
    });
  });
});
