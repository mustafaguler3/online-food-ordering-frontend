import axiosClient from "./axiosClient";

const orderService = {
  getOrders: (orderStatus?: any, page = 0, size = 200) => {
    const params: any = { page, size };

    if (orderStatus) {
      params.orderStatus = orderStatus;
    }

    return axiosClient.get("/orders/all", { params });
  },
  getOrderById: (id: any) => axiosClient.post(`/orders/${id}`),
};

export default orderService;
