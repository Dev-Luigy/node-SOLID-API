import { GymsRepository } from 'src/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Gym } from '@prisma/client'

interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)

    if (!gyms) {
      throw new ResourceNotFoundError()
    }

    return {
      gyms,
    }
  }
}
