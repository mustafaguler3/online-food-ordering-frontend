import axiosClient from "./axiosClient"

const authService =  {
    register: (data:any)  => axiosClient.post("/auth/register", data),
    login: (data:any) => axiosClient.post("/auth/login",data),
}

export default authService;