import { Role } from "./Role"

export interface User {
    id: number
    name: string
    profileUrl: any
    email: string
    phoneNumber: number
    address: string
    roles: Role[] | any
}