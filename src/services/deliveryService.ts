import axiosClient from "./axiosClient";

const deliveryService =  {
    assignedOrders: (): any => axiosClient.get(`/delivery/orders/assigned`),
    updateOrderStatus: (orderId:any,status: string): any => axiosClient.put(`/delivery/orders/${orderId}/status?status=${status}`)
}

export default deliveryService;