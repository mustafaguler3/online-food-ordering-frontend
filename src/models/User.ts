import { Order } from "./Order"
import { Role } from "./Role"

export interface User {
    id: number
    name: string
    profileUrl: any
    email: string
    phoneNumber: number
    orders: Order[]
    address: string
    roles: Role[] | any
}