import { Order } from "./Order"
import { User } from "./User"

export interface Payment {
    id:number
    orderId: number
    amount: number
    paymentStatus: any
    transactionId: number
    paymentGateway: any
    failureReason: any
    paymentDate: Date
    success: any
    order: Order
    user: User
}
