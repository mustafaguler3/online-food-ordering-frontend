import axiosClient from "./axiosClient";

const deliveryService =  {
    assignedOrders: (): any => axiosClient.get(`/delivery/orders/assigned`),
    updateOrderStatus: (orderId:any,status: string): any => axiosClient.put(`/delivery/orders/${orderId}/status?status=${status}`),
    trackingOrder: (orderId: any) => axiosClient.get(`/delivery/location/order/${orderId}/tracking`),
    locationStart: (orderId: any) => axiosClient.post(`/delivery/order/${orderId}/location`),
    deliveredOrders: ():any => axiosClient.get(`/delivery/orders/delivered`)
}

export default deliveryService;