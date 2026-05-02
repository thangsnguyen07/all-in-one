import { Test } from '@nestjs/testing'

import { InjectionToken } from '@/modules/user/application/injection-token'
import { UpdateUserPasswordCommand } from '@/modules/user/domain/use-cases/commands/update-password.command'
import { User } from '@/modules/user/domain/user.model'
import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { UserMapper } from '@/modules/user/infrastructure/mappers/user.mapper'
import { ArgumentInvalidException, NotFoundException } from 'core'

import { UpdateUserPasswordHandler } from '../update-password.handler'

const mockUserRepository = {
  findOneById: jest.fn(),
  save: jest.fn(),
}

describe('UpdateUserPasswordHandler', () => {
  let handler: UpdateUserPasswordHandler

  const defaultUserData = {
    userId: 'user-123',
    currentPassword: 'oldPassword123!',
    newPassword: 'newPassword123!',
  }

  const createValidCommand = (overrides?: Partial<typeof defaultUserData>) =>
    new UpdateUserPasswordCommand({ ...defaultUserData, ...overrides })

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateUserPasswordHandler,
        { provide: InjectionToken.USER_REPOSITORY, useValue: mockUserRepository },
        { provide: InjectionToken.USER_MAPPER, useClass: UserMapper },
      ],
    }).compile()

    handler = module.get<UpdateUserPasswordHandler>(UpdateUserPasswordHandler)

    jest.clearAllMocks()
  })

  describe('execute', () => {
    const mockUser = {
      id: defaultUserData.userId,
      getProps: jest.fn().mockReturnValue({
        password: {
          compare: jest.fn(),
          getHashedValue: jest.fn().mockReturnValue('hashedOldPassword'),
        },
        email: { value: 'test@example.com' },
        username: 'testuser',
        isActive: true,
        isVerified: true,
      }),
      updatePassword: jest.fn(),
    } as unknown as User

    const mockResponse = {
      id: defaultUserData.userId,
      username: 'testuser',
      email: 'test@example.com',
      isActive: true,
      isVerified: true,
    }

    test.each([
      {
        description: 'user not found',
        data: {},
        expectedError: NotFoundException,
        setup: () => mockUserRepository.findOneById.mockResolvedValue(null),
      },
      {
        description: 'wrong current password',
        data: {},
        expectedError: ArgumentInvalidException,
        setup: () => {
          mockUserRepository.findOneById.mockResolvedValue(mockUser)
          jest.spyOn(mockUser.getProps().password, 'compare').mockResolvedValue(false)
        },
      },
      {
        description: 'invalid new password format',
        data: { newPassword: 'weak' },
        expectedError: Error,
        setup: () => {
          mockUserRepository.findOneById.mockResolvedValue(mockUser)
          jest.spyOn(mockUser.getProps().password, 'compare').mockResolvedValue(true)
          jest.spyOn(Password, 'create').mockRejectedValue(new Error('Invalid password'))
        },
      },
    ])('should fail with $description', async ({ data, expectedError, setup }) => {
      setup()
      const command = createValidCommand(data)
      await expect(handler.execute(command)).rejects.toThrow(expectedError)
    })

    it('should update password and save user when validation passes', async () => {
      mockUserRepository.findOneById.mockResolvedValue(mockUser)
      jest.spyOn(mockUser.getProps().password, 'compare').mockResolvedValue(true)

      const mockNewPassword = { getHashedValue: jest.fn().mockReturnValue('hashedNewPassword') }
      jest.spyOn(Password, 'create').mockResolvedValue(mockNewPassword as any)

      const result = await handler.execute(createValidCommand())

      expect(mockUserRepository.findOneById).toHaveBeenCalledWith(defaultUserData.userId)
      expect(mockUser.getProps().password.compare).toHaveBeenCalledWith(
        defaultUserData.currentPassword,
      )
      expect(Password.create).toHaveBeenCalledWith(defaultUserData.newPassword)
      expect(mockUser.updatePassword).toHaveBeenCalledWith(mockNewPassword)
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser)
      expect(result).toEqual(mockResponse)
    })
  })
})
