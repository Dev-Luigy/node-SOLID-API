import { Gym } from '@prisma/client'
import { GymsRepository } from 'src/repositories/gyms-repository'

interface FetchNearGymsUseCaseRequest {
  userLongitute: number
  userLatitute: number
}

interface FetchNearGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchUserCheckInsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLongitute,
    userLatitute,
  }: FetchNearGymsUseCaseRequest): Promise<FetchNearGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      longitute: userLongitute,
      latitute: userLatitute,
    })

    if (!gyms) throw new Error('Not have a known gym in around')

    return {
      gyms,
    }
  }
}
