import { expect, it, describe, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from 'src/repositories/tests/test-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should create user', async () => {
    const { gym } = await sut.execute({
      description: '',
      latitute: -4.9634267,
      longitute: -39.0201344,
      phone: '',
      title: 'acad',
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
