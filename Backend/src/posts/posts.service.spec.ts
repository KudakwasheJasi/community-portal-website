import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsService } from './posts.service';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: Repository<Post>;
  let userRepository: Repository<User>;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  };

  const mockPost = {
    id: 'post-1',
    title: 'Test Post',
    content: 'Test content',
    status: 'published',
    authorId: 'user-1',
    author: mockUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post successfully', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test content',
        status: 'published',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(postRepository, 'create').mockReturnValue(mockPost as Post);
      jest.spyOn(postRepository, 'save').mockResolvedValue(mockPost as Post);

      const result = await service.create(createPostDto, 'user-1');

      expect(result).toEqual(mockPost);
      expect(postRepository.create).toHaveBeenCalledWith({
        ...createPostDto,
        authorId: 'user-1',
        author: mockUser,
      });
    });

    it('should throw NotFoundException if author not found', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test content',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(createPostDto, 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockPost], 1]),
      };

      jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.items).toEqual([mockPost]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe('findOne', () => {
    it('should return a post if found', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost as Post);

      const result = await service.findOne('post-1');

      expect(result).toEqual(mockPost);
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('post-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post successfully', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const updatedPost = { ...mockPost, ...updatePostDto };

      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost as Post);
      jest.spyOn(postRepository, 'save').mockResolvedValue(updatedPost as Post);

      const result = await service.update('post-1', updatePostDto, 'user-1');

      expect(result.title).toBe('Updated Title');
      expect(result.content).toBe('Updated content');
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update('post-1', {}, 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if user is not the author', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost as Post);

      await expect(service.update('post-1', {}, 'different-user')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a post successfully', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost as Post);
      jest.spyOn(postRepository, 'remove').mockResolvedValue(mockPost as Post);

      await service.remove('post-1', 'user-1');

      expect(postRepository.remove).toHaveBeenCalledWith(mockPost);
    });

    it('should throw BadRequestException if user is not the author', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(mockPost as Post);

      await expect(service.remove('post-1', 'different-user')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});