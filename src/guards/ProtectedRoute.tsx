import { Navigate } from "react-router-dom";
import { AuthHelper } from "../helpers/AuthHelper";

const ProtectedRoute = ({ children, roles }) => {
  const isAuthenticated = AuthHelper.isAuthenticated(); // token kontrolü
  let userRoles:any = localStorage.getItem("roles");

  try {
    userRoles = JSON.parse(userRoles); // ["DELIVERY"]
  } catch (e) {
    userRoles = [userRoles]; // "DELIVERY" ise
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!userRoles || userRoles.length === 0) {
    return <Navigate to="/unauthorized" />;
  }

  // Kullanıcının rolleri ile izin verilen roller kesişiyor mu?
  const hasAccess = roles.some((r) => userRoles.includes(r));

  if (!hasAccess) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
