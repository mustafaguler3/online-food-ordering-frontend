import axiosClient from "./axiosClient";


const categoryService = {
    getCategories: () => axiosClient.get("/categories/all"),
    getCategoryById: (id:any) => axiosClient.get(`/categories/${id}`),
    deleteCategoryById: (id: number) => axiosClient.get(`/categories/${id}`),
    updateCategory: (data:any) => axiosClient.put("/categories",data),
    createCategory: (data:any) => axiosClient.post("/categories",data)
}

export default categoryService;