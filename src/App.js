import logo from "./logo.svg";
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
import { AdminRoute, CustomerRoute } from "./services/Guard";
import LeaveReviewPage from "./components/profile_cart/LeaveReviewPage";
import CartPage from "./components/profile_cart/CartPage";
import ProcessPaymentPage from "./components/payment/ProcessPaymentPage";
import AdminLayout from "./components/admin/navbar/AdminLayout";
import AdminCategoriesPage from "./components/admin/AdminCategoriesPage";
import AdminCategoryFormPage from "./components/admin/AdminCategoryFormPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:id" element={<MenuDetailsPage />} />
          <Route
            path="/profile" element={<ProfilePage />} />
          
          <Route path="/update" element={<UpdateProfilePage />} />
          <Route path="/my-order-history" element={<OrderHistoryPage />} />
          <Route path="/leave-review" element={<LeaveReviewPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/pay" element={<ProcessPaymentPage/>}/>

          {/* Admin Route */}
          <Route path="/admin"  element={<AdminRoute element={<AdminLayout/>}/>} >
            <Route path="categories" element={<AdminCategoriesPage/>}/>
            <Route path="categories/new" element={<AdminCategoryFormPage/>}/>
            <Route path="categories/edit':id'" element={<AdminCategoryFormPage/>}/>
          </Route>
          


          <Route path="*" element={<Navigate to={"/home"} />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
