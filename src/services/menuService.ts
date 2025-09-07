import axiosClient from "./axiosClient";

const menuService = {
    getMenus: () => axiosClient.get("/menus"),
    addMenu: (formData:any) => axiosClient.post("/menus",formData),
    updateMenu: (data:any) => axiosClient.put("/menus",data),
    getAllMenuByCategoryId: (categoryId:any,search?:any) => {
        const params:any = {categoryId,search};

        if (params) {
            params.categoryId = categoryId;
            params.search = search;
        }

        return axiosClient.get(`/menus`,{params})
    },
    getMenuById: (id:any) => axiosClient.get(`/menus/${id}`),
    deleteMenuById: (id:any) => axiosClient.delete(`/menus/${id}`)
}

export default menuService;