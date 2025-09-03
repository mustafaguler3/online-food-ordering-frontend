import axiosClient from "./axiosClient";

const menuService = {
    getMenus: () => axiosClient.get("/menus"),
    getMenuById: (id:any) => axiosClient.get(`/menus/${id}`)
}

export default menuService;