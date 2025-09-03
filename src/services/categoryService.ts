import axiosClient from "./axiosClient";


const categoryService = {
    getCategories: () => axiosClient.get("/categories/all")
}

export default categoryService;