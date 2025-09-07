import axiosClient from "./axiosClient";


export const cartService = {
    getCart: () => axiosClient.get("/cart"),
    addItemToCart: (data: any) => axiosClient.post(`/cart/items`,data),
    incrementItem: (menuId: any) => axiosClient.put(`/cart/items/increment/${menuId}`),
    decrementItem: (menuId: any) => axiosClient.put(`/cart/items/decrement/${menuId}`),
    removeItem: (cartItemId: any) => axiosClient.delete(`/cart/items/${cartItemId}`)
}