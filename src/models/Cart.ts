import { Menu } from "./Menu"

export interface Cart {
    id: number
    cartItems: CartItem[],
    menuId: number,
    quantity: number,
    totalAmount: number
}

export interface CartItem {
    id: number
    menu: Menu,
    quantity: number,
    pricePerUnit: number,
    subtotal: number
}