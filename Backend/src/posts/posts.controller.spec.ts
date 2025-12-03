import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockUser = { id: 'user-1', email: 'test@example.com' };
  const mockPost = {
    id: 'post-1',
    title: 'Test Post',
    content: 'Test content',
    status: 'published',
    authorId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPostsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        content: 'Test content',
      };

      const mockRequest = { user: mockUser };
      const result = { ...mockPost };

      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(createPostDto, mockRequest as any)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createPostDto, mockUser.id);
    });
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const result = {
        items: [mockPost],
        total: 1,
        page: 1,
        limit: 10,
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll(1, 10, 'published')).toBe(result);
      expect(service.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        status: 'published',
      });
    });
  });

  describe('findOne', () => {
    it('should return a post', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPost as any);

      expect(await controller.findOne('post-1')).toBe(mockPost);
      expect(service.findOne).toHaveBeenCalledWith('post-1');
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
      };

      const mockRequest = { user: mockUser };
      const result = { ...mockPost, title: 'Updated Title' };

      jest.spyOn(service, 'update').mockResolvedValue(result as any);

      expect(await controller.update('post-1', updatePostDto, mockRequest as any)).toBe(result);
      expect(service.update).toHaveBeenCalledWith('post-1', updatePostDto, mockUser.id);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const mockRequest = { user: mockUser };

      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove('post-1', mockRequest as any)).toEqual({
        message: 'Post deleted successfully',
      });
      expect(service.remove).toHaveBeenCalledWith('post-1', mockUser.id);
    });
  });
});