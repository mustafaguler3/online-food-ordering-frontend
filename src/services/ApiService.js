import axios from "axios";

export default class ApiService {
  static BASE_URL = "http://localhost:8080/api";

  static saveToken(token) {
    localStorage.setItem("token", token);
  }

  static getToken() {
    return localStorage.getItem("token");
  }

  // save role
  static saveRole(roles) {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  //get roles from local storage
  static getRoles() {
    const roles = localStorage.getItem("roles");
    return roles ? JSON.parse(roles) : null;
  }

  // check if the user has a specific role
  static hadRole(role) {
    const roles = this.getRoles();
    return roles ? roles.includes(role) : false;
  }

  static isAdmin() {
    return this.hadRole("ROLE_ADMIN");
  }

  static isCustomer() {
    return this.hadRole("ROLE_CUSTOMER");
  }

  static isDeliveryPerson() {
    return this.hadRole("ROLE_DELIVERY");
  }

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
  }

  static isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  static getHeader() {
    const token = this.getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  static async registerUser(data) {
    const resp = await axios.post(`${this.BASE_URL}/auth/register`, data);
    return resp.data;
  }

  static async loginUser(data) {
    const resp = await axios.post(`${this.BASE_URL}/auth/login`, data);
    return resp.data;
  }

  /** User Profile Management Section */
  static async myProfile() {
    const resp = await axios.get(`${this.BASE_URL}/users/account`, {
      headers: this.getHeader(),
    });

    return resp.data;
  }

  static async updateProfile(formData) {
    const resp = await axios.put(`${this.BASE_URL}/users/update`, formData, {
      headers: {
        ...this.getHeader(),
        "Content-Type": "multipart/form-data",
      },
    });

    return resp.data;
  }

  static async deactivateProfile() {
    const resp = await axios.delete(`${this.BASE_URL}/users/deactivate`, {
      headers: this.getHeader(),
    });

    return resp.data;
  }
  //ORDER SECTION
  static async placeOrder() {
    const resp = await axios.post(
      `${this.BASE_URL}/orders/checkout`,
      {},
      {
        headers: this.getHeader(),
      }
    );
    return resp.data;
  }
  static async initiateDelivery(body) {
    const resp = await axios.post(
      `${this.BASE_URL}/orders/initiate-delivery`,
      body,
      {
        headers: this.getHeader(),
      }
    );
    return resp.data;
  }

  static async updateOrderStatus(body) {
    const resp = await axios.put(`${this.BASE_URL}/orders/update`, body, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async getAllOrders(orderStatus, page = 0, size = 200) {
    let url = `${this.BASE_URL}/orders/all`;

    if (orderStatus) {
      url = `${this.BASE_URL}/orders/all?orderStatus=${orderStatus}&page=${page}&size=${size}`;
    }

    const resp = await axios.get(url, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async getMyOrders() {
    const resp = await axios.get(`${this.BASE_URL}/orders/me`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async getOrderById(id) {
    const resp = await axios.get(`${this.BASE_URL}/orders/${id}`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async countTotalActiveCustomers() {
    const resp = await axios.get(`${this.BASE_URL}/orders/unique-customers`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async getOrderItemById(id) {
    const resp = await axios.get(`${this.BASE_URL}/orders/order-item/${id}`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  /* CATEGORY SECTION */
  static async getAllCategories() {
    console.log("getAllCategories() was called");
    const resp = await axios.get(`${this.BASE_URL}/categories/all`);
    console.log("response is: " + resp.data);
    return resp.data;
  }

  static async getCategoryById(id) {
    const resp = await axios.get(`${this.BASE_URL}/categories/${id}`);
    return resp.data;
  }

  static async createCategory(body) {
    const resp = await axios.post(`${this.BASE_URL}/categories`, body, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async updateCategory(body) {
    const resp = await axios.put(`${this.BASE_URL}/categories`, body, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async deleteCategory(id) {
    const resp = await axios.delete(`${this.BASE_URL}/categories/${id}`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  /* MENU SECTION */

  static async addMenu(formData) {
    const resp = await axios.post(`${this.BASE_URL}/menus`, formData, {
      headers: {
        ...this.getHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return resp.data;
  }

  static async updateMenu(formData) {
    const resp = await axios.put(`${this.BASE_URL}/menus`, formData, {
      headers: {
        ...this.getHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return resp.data;
  }

  static async deleteMenu(id) {
    const resp = await axios.delete(`${this.BASE_URL}/menus/${id}`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async getMenuById(id) {
    const resp = await axios.get(`${this.BASE_URL}/menus/${id}`);
    return resp.data;
  }

  static async getAllMenus() {
    const resp = await axios.get(`${this.BASE_URL}/menus`, {});
    return resp.data;
  }

  static async getAllMenuByCategoryId(categoryId) {
    const resp = await axios.get(`${this.BASE_URL}/menus`, {
      params: {
        categoryId: categoryId,
      },
    });
    return resp.data;
  }

  static async searchMenu(search) {
    const resp = await axios.get(`${this.BASE_URL}/menus`, {
      params: {
        search: search,
      },
    });
    return resp.data;
  }

  /* CART SECTION */
  static async addItemToCart(cartDTO) {
    const resp = await axios.post(`${this.BASE_URL}/cart/items`, cartDTO, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async incrementItem(menuId) {
    const resp = await axios.put(
      `${this.BASE_URL}/cart/items/increment/${menuId}`,
      null,
      {
        headers: this.getHeader(),
      }
    );
    return resp.data;
  }

  static async decrementItem(menuId) {
    const resp = await axios.put(
      `${this.BASE_URL}/cart/items/decrement/${menuId}`,
      null,
      {
        headers: this.getHeader(),
      }
    );
    return resp.data;
  }

  static async removeItem(cartItemId) {
    const resp = await axios.delete(
      `${this.BASE_URL}/cart/items/${cartItemId}`,
      {
        headers: this.getHeader(),
      }
    );
    return resp.data;
  }

  static async getCart() {
    const resp = await axios.get(`${this.BASE_URL}/cart`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async clearCart() {
    const resp = await axios.delete(`${this.BASE_URL}/api/cart`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  /**REVIEW SECTION */
  static async getMenuAverageOverallReview(menuId) {
    const resp = await axios.get(
      `${this.BASE_URL}/reviews/menu-item/average/${menuId}`
    );
    return resp.data;
  }
  static async createReview(body) {
    const resp = await axios.post(`${this.BASE_URL}/reviews`, body, {
      headers: this.getHeader(),
    });
    return resp.data;
  }
  /**PAYMENT SESSION */
  //funtion to create payment intent
  static async proceedForPayment(body) {
    const resp = await axios.post(`${this.BASE_URL}/payments/pay`, body, {
      headers: this.getHeader(),
    });
    return resp.data; //return the resp containg the stripe transaction id for this transaction
  }

  //TO UPDATE PAYMENT WHEN IT HAS BEEN COMPLETED
  static async updateOrderPayment(body) {
    const resp = await axios.put(`${this.BASE_URL}/payments/update`, body, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async getAllPayments() {
    const resp = await axios.get(`${this.BASE_URL}/payments/all`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }

  static async getAPaymentById(paymentId) {
    const resp = await axios.get(`${this.BASE_URL}/payments/${paymentId}`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }
}
