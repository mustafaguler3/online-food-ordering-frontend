import axiosClient from "./axiosClient";

const deliveryService =  {
    assignedOrders: (): any => axiosClient.get(`/delivery/orders/assigned`),
    updateOrderStatus: (orderId:any,status: string): any => axiosClient.put(`/delivery/orders/${orderId}/status?status=${status}`),
    trackingOrder: (orderId: any) => axiosClient.get(`/delivery/location/order/${orderId}/tracking`),
    locationStart: (orderId: any) => axiosClient.post(`/delivery/order/${orderId}/location`),
    deliveredOrders: ():any => axiosClient.get(`/delivery/orders/delivered`),
    updateLocation : (deliveryId:any,lat?: any,lng?: any) :any => axiosClient.post(`/delivery/order/update/location?deliveryId=${deliveryId}&lat=${lat}&lng=${lng}`)
}

export default deliveryService;