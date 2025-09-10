import { User } from "./User"

export interface Order {
    id: any
    orderDate: Date
    totalAmount: number
    orderStatus: any
    menuId: number
    deliveryPersonName: string
    deliveryPersonId: number
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