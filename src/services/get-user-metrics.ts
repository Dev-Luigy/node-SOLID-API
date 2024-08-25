import { CheckInsRepository } from "src/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { UsersRepository } from "src/repositories/users-repository";

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number;
}

export class GetUserMetricsUseCase {
  constructor(
    private userRepository: UsersRepository,
    private checkInsRepository: CheckInsRepository,
  ) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new ResourceNotFoundError();

    const checkInsCount: number =
      await this.checkInsRepository.countByUserId(userId);

    return {
      checkInsCount,
    };
  }
}
