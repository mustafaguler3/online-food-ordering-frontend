import { Order } from "./Order";
import { User } from "./User";

export interface DeliveryPerson {
    id: number
    user: User
    vehicleType: string
    orders: Order[]
    deliveryLocations: DeliveryLocation[]
    lisenceNumber: string
    online: boolean
    currentLat: number
    currentLng: number
    hasActiveOrder: boolean
}

export interface DeliveryLocation {
    id: number
    deliveryPerson: DeliveryPerson
    latitude: number
    longitude: number
    timestamp: Date
}