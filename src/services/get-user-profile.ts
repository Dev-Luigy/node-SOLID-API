import { UsersRepository } from 'src/repositories/users-repository'
import { InvalidCredentials } from './errors/invalid-credentials-error'

interface GetUserProfileRequest {
  userId: string
}

interface GetUserProfileResponse {}

export class GetUserProfile {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new InvalidCredentials()
    }

    return {
      user,
    }
  }
}
