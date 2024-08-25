import { Gym, Prisma } from '@prisma/client'

export interface findManyNearbyParams {
  latitute: number
  longitute: number
}

export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(gymId: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  findManyNearby(params: findManyNearbyParams): Promise<Gym[]>
}
