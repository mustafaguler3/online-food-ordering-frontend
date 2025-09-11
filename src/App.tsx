import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import RegisterPage from "./components/auth/RegisterPage";
import LoginPage from "./components/auth/LoginPage";
import HomePage from "./components/home_menu/HomePage";
import CategoriesPage from "./components/home_menu/CategoriesPage";
import MenuPage from "./components/home_menu/MenuPage";
import MenuDetailsPage from "./components/home_menu/MenuDetailsPage";
import ProfilePage from "./components/profile_cart/ProfilePage";
import UpdateProfilePage from "./components/profile_cart/UpdateProfilePage";
import OrderHistoryPage from "./components/profile_cart/OrderHistoryPage";
import LeaveReviewPage from "./components/profile_cart/LeaveReviewPage";
import CartPage from "./components/profile_cart/CartPage";
import ProcessPaymentPage from "./components/payment/ProcessPaymentPage";
import AdminLayout from "./components/admin/navbar/AdminLayout";
import AdminCategoriesPage from "./components/admin/AdminCategoriesPage";
import AdminCategoryFormPage from "./components/admin/AdminCategoryFormPage";
import AdminMenuPage from "./components/admin/AdminMenuPage";
import AdminMenuFormPage from "./components/admin/AdminMenuFormPage";
import AdminOrdersPage from "./components/admin/AdminOrdersPage";
import AdminOrderDetailPage from "./components/admin/AdminOrderDetailPage";
import AdminPaymentsPage from "./components/admin/AdminPaymentsPage";
import AdminPaymentDetailPage from "./components/admin/AdminPaymentDetailPage";
import AdminDashboardPage from "./components/admin/AdminDashboardPage";
import AdminUserRegistration from "./components/auth/AdminUserRegistration";
import { CartProvider } from "./context/CartContext";
import AdminUsersPage from "./components/admin/AdminUsersPage";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./context/UserContext";
import RestaurantsPage from "./components/home_menu/RestaurantsPage";
import RestaurantsDetailPage from "./components/home_menu/RestaurantsDetailPage";
import AdminRestaurantsPage from "./components/admin/AdminRestaurantsPage";
import ProtectedRoute from "./guards/ProtectedRoute";
import DeliveryDashboardPage from "./components/delivery/DeliveryDashboardPage";
import { DeliveryLayout } from "./components/delivery/navbar/DeliveryLayout";
import { AuthHelper } from "./helpers/AuthHelper";
import { useEffect, useState } from "react";
import DeliveryAssignedOrdersPapge from "./components/delivery/DeliveryAssignedOrdersPage";
import DeliveryAssignedOrdersPage from "./components/delivery/DeliveryAssignedOrdersPage";
import AdminDeliveriesPage from "./components/admin/AdminDeliveriesPage";
import 'leaflet/dist/leaflet.css';
import DeliveryDeliveredOrdersPage from "./components/delivery/DeliveryDeliveredOrdersPage";


function App() {
  const isAuthenticated = AuthHelper.isAuthenticated()
  const isCustomer = AuthHelper.isCustomer()
  const isAdmin = AuthHelper.isAdmin();
  const isDelivery = AuthHelper.isDeliveryPerson();

  return (
    <UserProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-container">

            {(!isAuthenticated || isCustomer) && <Navbar />}

            <ToastContainer />
            <main className="main-content">
              <Routes>
                {/* Public routes */}
                <Route index path="/home" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route
                  path="/restaurants/:restaurantId"
                  element={<RestaurantsDetailPage />}
                />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/menus" element={<MenuPage />} />
                <Route path="/menus/:id" element={<MenuDetailsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/update" element={<UpdateProfilePage />} />
                <Route
                  path="/my-order-history"
                  element={<OrderHistoryPage />}
                />
                <Route path="/leave-review" element={<LeaveReviewPage />} />

                {/* CUSTOMER protected routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute roles={["CUSTOMER"]}>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pay"
                  element={
                    <ProtectedRoute roles={["CUSTOMER"]}>
                      <ProcessPaymentPage />
                    </ProtectedRoute>
                  }
                />

                {/* DELIVERY protected routes */}
                <Route
                  path="/delivery"
                  element={
                    <ProtectedRoute roles={["DELIVERY"]}>
                      <DeliveryLayout/> 
                    </ProtectedRoute>
                  }
                >
                  <Route path="orders/delivered" element={<DeliveryDeliveredOrdersPage/>}/>
                  <Route index element={<DeliveryDashboardPage />} />
                  <Route path="orders/assigned" element={<DeliveryAssignedOrdersPage/>}/>
                </Route>

                {/* ADMIN protected routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={["ADMIN"]}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="deliveries" element={<AdminDeliveriesPage/>}/>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route
                    path="categories/new"
                    element={<AdminCategoryFormPage />}
                  />
                  <Route
                    path="categories/edit/:id"
                    element={<AdminCategoryFormPage />}
                  />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route
                    path="restaurants"
                    element={<AdminRestaurantsPage />}
                  />
                  <Route path="menu-items" element={<AdminMenuPage />} />
                  <Route path="menu-items/new" element={<AdminMenuPage />} />
                  <Route
                    path="menu-items/edit/:id"
                    element={<AdminMenuFormPage />}
                  />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="orders/:id" element={<AdminOrderDetailPage />} />
                  <Route path="payments" element={<AdminPaymentsPage />} />
                  <Route
                    path="payments/:id"
                    element={<AdminPaymentDetailPage />}
                  />
                  <Route path="register" element={<AdminUserRegistration />} />
                </Route>

                {/* fallback */}
                <Route path="*" element={<Navigate to="/home" />} />

              </Routes>
            </main>

            {(!isAuthenticated || isCustomer) && <Footer />}
          </div>
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  );
}
export default App;
