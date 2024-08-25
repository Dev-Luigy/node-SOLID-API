import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from 'src/repositories/tests/test-check-ins-repository'
import { InMemoryUsersRepository } from 'src/repositories/tests/test-users-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let usersRepository: InMemoryUsersRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics use case', async () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserMetricsUseCase(usersRepository, checkInsRepository)
  })
  it('Should be possible to get user check ins count from metrics', async () => {
    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6),
    })

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
    expect(checkInsCount).toStrictEqual(expect.any(Number))
  })
  it('Should send error if userId are wrong/inexistent', async () => {
    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password_hash: await hash('123456', 6),
    })

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await expect(() =>
      sut.execute({
        userId: 'invalid user id.',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
