import axiosClient from "./axiosClient";

const orderService = {
  placeOrder: () => axiosClient.post("/orders/checkout"),
  getOrderItemById: (id: any) => axiosClient.get(`/orders/order-item/${id}`),
  getMyOrders: () => axiosClient.get(`/orders/me`),
  getOrders: (orderStatus?: any, page = 0, size = 200) => {
    const params: any = { orderStatus,page, size };

    if (orderStatus) {
      params.orderStatus = orderStatus;
    }

    return axiosClient.get("/orders/all", { params });
  },
  getOrderById: (id: any) => axiosClient.get(`/orders/${id}`),
  updateOrderStatus: (body:any) => axiosClient.put(`/orders/update`,body),
  countTotalActiveCustomers: () => axiosClient.get("/orders/unique-customers")
};


export default orderService;
