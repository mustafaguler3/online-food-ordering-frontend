import { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { User } from "../../models/User";
import { DeliveryPerson } from "../../models/DeliveryPerson";

const AdminDeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState<DeliveryPerson[]>([]);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await adminService.getDeliveries();

        if (response.statusCode === 200) {
          setDeliveries(response.data);
          setError(null);
        } else {
          setError(response?.message);
        }
      } catch (err) {
        setError(err?.message);
      }
    };

    fetchDeliveries();
  }, []);

  if (deliveries.length === 0) {
    return <h1 className="alert alert-danger">No records</h1>
  }

  return (
    <>
    {error ? <h2 className="alert alert-warning">{error}</h2> : null}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Has Active Order</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr>
              <td>{delivery.id}</td>
              <td>{delivery.user.name}</td>
              <td>{delivery.user.email}</td>
              <td>{delivery.user.phoneNumber}</td>
              <td>{delivery.hasActiveOrder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AdminDeliveriesPage;
