import { GymsRepository } from '../gyms-repository'
import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'node:crypto'

export class InMemoryGymsRepository implements GymsRepository {
  private gyms: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      description: data.description ?? null,
      latitute: data.latitute as Decimal,
      longitute: data.longitute as Decimal,
      phone: data.phone ?? null,
      title: data.title,
    }

    this.gyms.push(gym)
    return gym
  }

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
