import type { Gym } from '@prisma/client'
import { GymsRepository } from 'src/repositories/gyms-repository'

interface CreateGymUseCaseRequest {
  title: string
  description: string | null
  phone: string | null
  latitute: number
  longitute: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    description,
    title,
    phone,
    latitute,
    longitute,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      description,
      title,
      phone,
      latitute,
      longitute,
    })

    return {
      gym,
    }
  }
}
