import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from 'src/repositories/tests/test-check-ins-repository'
import { FetchUserCheckInsUseCase } from './fetch-user-check-ins-history'
import { InMemoryUsersRepository } from 'src/repositories/tests/test-users-repository'
import { hash } from 'bcryptjs'

let checkInsRepository: InMemoryCheckInsRepository
let usersRepository: InMemoryUsersRepository
let sut: FetchUserCheckInsUseCase

describe('Fetch Check Ins of User Use Case', async () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUserCheckInsUseCase(usersRepository, checkInsRepository)

    await usersRepository.create({
      id: 'user-01',
      name: 'user-01',
      email: 'email@exemple.com',
      password_hash: await hash('123456', 6),
    })
  })
  it('should be able to get user history of check ins', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toBeInstanceOf(Array)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })
  it('should be able to get paginated user history of check ins', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
