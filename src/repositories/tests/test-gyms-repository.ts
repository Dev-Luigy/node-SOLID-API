import { GymsRepository, findManyNearbyParams } from '../gyms-repository'
import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from 'src/utils/get-distant-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  private gyms: Gym[] = []

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.gyms
      .filter((gym) => gym.id.includes(query) || gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

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

  async findManyNearby(params: findManyNearbyParams): Promise<Gym[]> {
    return this.gyms.filter((e) => {
      const distant = getDistanceBetweenCoordinates(
        {
          latitude: params.latitute,
          longitude: params.longitute,
        },
        {
          latitude: e.latitute.toNumber(),
          longitude: e.longitute.toNumber(),
        },
      )

      return distant < 10
    })
  }

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
