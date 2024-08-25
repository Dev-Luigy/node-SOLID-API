import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from 'src/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UsersRepository } from 'src/repositories/users-repository'

interface FetchUserCheckInsUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsUseCase {
  constructor(
    private userRepository: UsersRepository,
    private checkInsRepository: CheckInsRepository,
  ) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsUseCaseRequest): Promise<FetchUserCheckInsUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) throw new ResourceNotFoundError()

    const checkIns: CheckIn[] = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
