import axiosClient from "./axiosClient";

const adminService = {
    assignDeliveryToOrder: (orderId: any) => axiosClient.post(`/admin/orders/assign?orderId=${orderId}`)
}

export default adminService;