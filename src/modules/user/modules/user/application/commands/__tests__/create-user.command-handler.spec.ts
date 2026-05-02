import { Test, TestingModule } from '@nestjs/testing'

import { InjectionToken } from '@/modules/user/application/injection-token'
import { CreateUserCommand } from '@/modules/user/domain/use-cases/commands/create-user.command'
import { UserRepositoryPort } from '@/modules/user/domain/user.repository.port'
import { UserMapper } from '@/modules/user/infrastructure/mappers/user.mapper'

import { CreateUserHandler } from '../create-user.handler'

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler
  let userRepository: UserRepositoryPort

  const mockUserRepository = {
    save: jest.fn(),
    findOneByUsername: jest.fn(),
  }

  const defaultUserData = {
    username: 'testuser',
    email: 'valid@example.com',
    password: 'ValidPass123!',
  }

  const createValidCommand = (overrides?: Partial<typeof defaultUserData>) =>
    new CreateUserCommand({ ...defaultUserData, ...overrides })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: InjectionToken.USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: InjectionToken.USER_MAPPER,
          useClass: UserMapper,
        },
      ],
    }).compile()

    handler = module.get<CreateUserHandler>(CreateUserHandler)
    userRepository = module.get<UserRepositoryPort>(InjectionToken.USER_REPOSITORY)

    // Reset mocks before each test
    jest.clearAllMocks()
  })

  describe('execute()', () => {
    test('should successfully create a user with valid data', async () => {
      const result = await handler.execute(createValidCommand())

      expect(userRepository.save).toHaveBeenCalledTimes(1)
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username: defaultUserData.username,
          email: defaultUserData.email,
        }),
      )
    })

    describe('validation failures', () => {
      const testCases = [
        {
          description: 'empty username',
          data: { username: '' },
          expectedError: 'Username is required',
        },
        {
          description: 'invalid email format',
          data: { email: 'invalid-email' },
          expectedError: 'Email is invalid',
        },
        {
          description: 'invalid password format',
          data: { password: 'weak' },
          expectedError: 'Password must contain at least 8 characters',
        },
      ]

      test.each(testCases)('should fail with $description', async ({ data, expectedError }) => {
        const command = createValidCommand(data)
        await expect(handler.execute(command)).rejects.toThrow(expectedError)
      })
    })

    test('should prevent duplicate usernames', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValueOnce({
        id: 'existing-user',
        ...defaultUserData,
      })

      await expect(handler.execute(createValidCommand())).rejects.toThrow(
        'User with this username already exists',
      )

      expect(userRepository.findOneByUsername).toHaveBeenCalledWith(defaultUserData.username)
    })

    test('should not return password in the response', async () => {
      const result = await handler.execute(createValidCommand())

      expect(userRepository.save).toHaveBeenCalledTimes(1)
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username: defaultUserData.username,
          email: defaultUserData.email,
        }),
      )
      expect(result).not.toHaveProperty('password')
    })

    test('should handle repository errors gracefully', async () => {
      const error = new Error('Database connection failed')

      mockUserRepository.save.mockRejectedValueOnce(error)

      await expect(handler.execute(createValidCommand())).rejects.toThrow(error)
    })
  })
})
