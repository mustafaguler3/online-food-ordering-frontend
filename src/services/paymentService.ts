import axiosClient from "./axiosClient";

const paymentService = {
    proceedForPayment: (data:any) => axiosClient.post("/payments/pay",data),
    updateOrderPayment: (data:any) => axiosClient.put("/payments/update",data),
    getPayments: () => axiosClient.get("/payments/all"),
    getPaymentById: (id:any) => axiosClient.get(`/payments/${id}`)
}

export default paymentService;