import axiosClient from "./axiosClient";


export const cartService = {
    getCart: () => axiosClient.get("/cart")
}