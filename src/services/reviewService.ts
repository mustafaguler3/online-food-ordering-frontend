import axiosClient from "./axiosClient";

const reviewService = {
    createReview: (body:any) => axiosClient.post(`/reviews`, body),
    getMenuAverageOverallReview: (menuId: any) => axiosClient.get(`/reviews/menu-item/average/${menuId}`)
}

export default reviewService;