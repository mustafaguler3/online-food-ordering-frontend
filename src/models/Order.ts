import { DeliveryPerson } from "./DeliveryPerson"
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
    menu: any
    restaurant: any
    pricePerUnit: number
    subtotal: number 
}