import axiosClient from "./axiosClient";

const adminService = {
    getDeliveries: (): any => axiosClient.get(`/admin/deliveries`),
    autoAssignDeliveryPerson: (orderId: any):any => axiosClient.post(`/admin/orders/${orderId}/assign/auto`),
    manuelAssignDeliveryPerson: (orderId: any,deliveryId: any):any => axiosClient.post(`/admin/orders/${orderId}/assign/manuel?deliveryId=${deliveryId}`)
}

export default adminService;