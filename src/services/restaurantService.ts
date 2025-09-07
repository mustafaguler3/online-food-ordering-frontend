import axiosClient from "./axiosClient";

const restaurantService = {
    getRestaurants: ():any => axiosClient.get("/restaurants"),
    getRestaurantById: (id: any):any => axiosClient.get(`/restaurants/${id}`)
}

export default restaurantService;