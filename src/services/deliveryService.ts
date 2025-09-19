import axiosClient from "./axiosClient";

const deliveryService =  {
    getDashboard: (): Promise<any> => axiosClient.get(`/delivery/dashboard`),
    getDeliveryLocation: (orderId: any): any => axiosClient.get(`/delivery/order/${orderId}/location`),
    assignedOrder: (orderId: number): any => axiosClient.get(`/delivery/orders/assigned/${orderId}`),
    assignedOrders: (): any => axiosClient.get(`/delivery/orders/assigned`),
    updateOrderStatus: (orderId:any,status: string): any => axiosClient.put(`/delivery/orders/${orderId}/status?status=${status}`),
    startLocation: (orderId: any) => axiosClient.post(`/delivery/order/${orderId}/location`),
    deliveredOrders: ():any => axiosClient.get(`/delivery/orders/delivered`),
    updateLocation : (deliveryId:any,lat?: any,lng?: any) :any => axiosClient.post(`/delivery/order/update/location?deliveryId=${deliveryId}&lat=${lat}&lng=${lng}`)
}

export default deliveryService;