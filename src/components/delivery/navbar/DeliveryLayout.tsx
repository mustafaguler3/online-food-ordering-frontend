import { Outlet } from "react-router-dom";
import { DeliverySidebar } from "./DeliverySidebar";
import { DeliveryTopbar } from "./DeliveryTopbar";
import "./DeliveryLayout.css"

export const DeliveryLayout = () => {
  return (
    <div className="delivery-layout">
      <DeliverySidebar />
      <div className="delivery-main">
        <DeliveryTopbar />
        <div className="delivery-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
};
