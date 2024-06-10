import { PrismaUsersRepository } from 'src/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegister() {
  const userRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(userRepository)

  return registerUseCase
}
