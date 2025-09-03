import axiosClient from "./axiosClient";

const paymentService = {
    initializePayment: (data:any) => axiosClient.post("/payments/pay",data),
    getPayments: () => axiosClient.get("/payments/all"),
    getPaymentById: (id:number) => axiosClient.get(`/payments/${id}`)
}

export default paymentService;