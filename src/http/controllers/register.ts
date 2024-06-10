import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UserAlreadyExistsError } from 'src/services/errors/user-already-exists-error'
import { makeRegister } from 'src/services/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  const data = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegister()

    await registerUseCase.execute(data)
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: err.message,
      })
    }

    throw err
  }

  return reply.status(201).send()
}
