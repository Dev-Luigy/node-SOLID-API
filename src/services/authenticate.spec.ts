import { InMemoryUsersRepository } from 'src/repositories/tests/test-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InvalidCredentials } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate use case', async () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it('should authenticate if credentials match', async () => {
    await usersRepository.create({
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6),
      name: 'John Doe',
    })

    const { user } = await sut.execute({
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should not possible to authenticate with wrong email.', async () => {
    await expect(async () => {
      await sut.execute({
        email: 'abc@gmail.com',
        password: '123456',
      })
    }).rejects.toThrow(InvalidCredentials)
  })
  it('should not possible to authenticate with wrong password.', async () => {
    await usersRepository.create({
      email: 'johndoe@gmail.com',
      password_hash: '123456',
      name: 'John Doe',
    })

    await expect(async () => {
      await sut.execute({
        email: 'johndoe@gmail.com',
        password: '1234567',
      })
    }).rejects.toThrow(InvalidCredentials)
  })
})
