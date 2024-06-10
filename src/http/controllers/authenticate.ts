import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidCredentials } from 'src/services/errors/invalid-credentials-error'
import { makeAuthenticate } from 'src/services/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  const data = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticate()

    await authenticateUseCase.execute(data)
  } catch (err) {
    if (err instanceof InvalidCredentials) {
      return reply.status(400).send({
        message: err.message,
      })
    }

    throw err
  }

  return reply.status(200).send()
}
