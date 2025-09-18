import { Address } from "./Address"
import { DeliveryPerson } from "./DeliveryPerson"
import { Menu } from "./Menu"
import { Restaurant } from "./Restaurant"
import { User } from "./User"

export interface Order {
    id: any
    orderDate: Date
    totalAmount: number
    orderStatus: any
    menuId: number
    orderCode: string
    deliveryAddress: Address
    deliveryPerson: DeliveryPerson
    restaurant: Restaurant
    paymentStatus: any
    user: User
    orderItems: OrderItem[]
}

export interface OrderItem {
    id: number
    quantity: number
    menuId: number
    name: string
    menu: Menu
    restaurant: Restaurant
    pricePerUnit: number
    subtotal: number 
}