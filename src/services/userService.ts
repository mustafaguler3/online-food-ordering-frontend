import axiosClient from "./axiosClient";


const userService = {
    all: () => axiosClient.get("/users/all"),
    myProfile: () => axiosClient.get("/users/account"),
    updateProfile: (formData: any) => axiosClient.put("/users/update",formData, {
        headers: {"Content-Type":"application/json"}
    }),
    deactiveAccount: () => axiosClient.get("/users/deactivate")
}

export default userService;