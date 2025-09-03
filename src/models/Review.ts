import { Order } from "./Order"

export interface Review {
    menuId: number
    orderId: number
    userName: string
    menuName: string
    rating: number
    comment: string
    orderDto: Order
    createdAt: Date
}