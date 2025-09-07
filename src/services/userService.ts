import axiosClient from "./axiosClient";


const userService = {
    getUsers: () => axiosClient.get("/users/all"),
    myProfile: () => axiosClient.get("/users/account"),
    updateProfile: (formData: any) => axiosClient.put("/users/update",formData,{
        headers: { "Content-Type": "multipart/form-data" }
    }),
    deactiveAccount: () => axiosClient.get("/users/deactivate")
}

export default userService;