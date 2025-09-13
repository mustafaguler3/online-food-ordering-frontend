import { Review } from "./Review"

export interface Menu {
    id: number
    name: string
    description: string
    price: number
    imageUrl: any
    restaurantId: number
    averageRating: number
    categoryId: number
    imageFile: any
    reviews: Review[]
}
