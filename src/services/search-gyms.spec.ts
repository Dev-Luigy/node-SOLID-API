import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from 'src/repositories/tests/test-gyms-repository'
import { SearchGymsUseCase } from 'src/services/search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', async () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)

    for (let i = 0; i < 20; ++i) {
      const gymId = String((i % 10) + 1).padStart(2, '0')
      await gymsRepository.create({
        id: `gym-${gymId}`,
        title: `gym-${gymId} test`,
        latitute: 0.0,
        longitute: 0.0,
      })
    }

    for (let i = 0; i < 20; ++i) {
      await gymsRepository.create({
        id: `gym-01`,
        title: `gym-01 test`,
        latitute: 0.0,
        longitute: 0.0,
      })
    }
  })
  it('shold be able to find gyms by id', async () => {
    const { gyms } = await sut.execute({
      query: 'gym-01',
      page: 1,
    })

    expect(gyms).toHaveLength(20)
    expect(gyms[0].longitute).toEqual(0.0)
    expect(gyms[0].latitute).toEqual(0.0)
    expect(gyms[0]).toEqual(
      expect.objectContaining({
        latitute: 0.0,
      }),
    )
  })
  it('should be able to find gyms by title', async () => {
    const { gyms } = await sut.execute({
      query: 'test',
      page: 1,
    })

    expect(gyms).toHaveLength(20)
    expect(gyms[0].longitute).toEqual(0.0)
    expect(gyms[0].latitute).toEqual(0.0)
  })
  it('should be able to find gyms in another search page', async () => {
    const { gyms } = await sut.execute({
      query: 'gym-01',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms[0].longitute).toEqual(0.0)
    expect(gyms[0].latitute).toEqual(0.0)
  })
})
