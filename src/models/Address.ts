import { User } from "./User"

export interface Address {
    id: number
    city: string
    state: string
    postalCode: string
    country: string
    latitude: number
    longitude: number
    user: User
}