import { InMemoryUsersRepository } from 'src/repositories/tests/test-users-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile use case', async () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })
  it('should get user profile if credentials match', async () => {
    const createdUser = await usersRepository.create({
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6),
      name: 'John Doe',
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })
  it('should not possible to get user profile with wrong id.', async () => {
    await expect(async () => {
      await sut.execute({
        userId: 'non-existing-id',
      })
    }).rejects.toThrow(ResourceNotFoundError)
  })
})
