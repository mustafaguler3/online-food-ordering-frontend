import { Menu } from "./Menu"
import { Order } from "./Order"

export interface Restaurant {
    id: number
    name: string
    address: string
    phone: number
    logoUrl: string
    imageUrl: string
    latitude: number
    longitude: number
    openingHours: number
    rating: number
    orders: Order[]
    menus: Menu[]
}