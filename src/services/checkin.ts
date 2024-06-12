import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from 'src/repositories/check-ins-repository'
import { GymsRepository } from 'src/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from 'src/utils/get-distant-between-coordinates'
import { MaxDistantError } from './errors/max-distant-error'
import { MaxNumbersOfCheckInsError } from './errors/max-numbers-of-check-ins-error'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitute: number
  userLongitute: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitute,
    userLongitute,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) throw new ResourceNotFoundError()

    const distant = getDistanceBetweenCoordinates(
      {
        latitude: userLatitute,
        longitude: userLongitute,
      },
      {
        latitude: gym.latitute.toNumber(),
        longitude: gym.longitute.toNumber(),
      },
    )

    const MAX_DISTANT_IN_KM = 0.1

    if (distant > MAX_DISTANT_IN_KM) throw new MaxDistantError()

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) throw new MaxNumbersOfCheckInsError()

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
