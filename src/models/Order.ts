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
    deliveryPerson: DeliveryPerson
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