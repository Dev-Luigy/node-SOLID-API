import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from 'src/repositories/tests/test-check-ins-repository'
import { CheckInUseCase } from './checkin'
import { InMemoryGymsRepository } from 'src/repositories/tests/test-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumbersOfCheckInsError } from './errors/max-numbers-of-check-ins-error'
import { MaxDistantError } from './errors/max-distant-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase
let gymsRepository: InMemoryGymsRepository

describe('Check Ins Use Case', async () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)
    vi.useFakeTimers()

    await gymsRepository.create({
      latitute: new Decimal(-4.9634267),
      longitute: new Decimal(-39.0201344),
      title: '',
      id: 'gym-01',
    })
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitute: -4.9634267,
      userLongitute: -39.0201344,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitute: -4.9634267,
      userLongitute: -39.0201344,
    })

    await expect(async () =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitute: -4.9634267,
        userLongitute: -39.0201344,
      }),
    ).rejects.toBeInstanceOf(MaxNumbersOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 0, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitute: -4.9634267,
      userLongitute: -39.0201344,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 0, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitute: -4.9634267,
      userLongitute: -39.0201344,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in distant gym ', async () => {
    await expect(
      async () =>
        await sut.execute({
          gymId: 'gym-01',
          userId: 'user-01',
          userLatitute: -40.9634267,
          userLongitute: -50.0201344,
        }),
    ).rejects.toBeInstanceOf(MaxDistantError)
  })
})
