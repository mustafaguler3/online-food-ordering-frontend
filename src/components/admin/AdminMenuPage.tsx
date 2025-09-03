import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { useError } from "../common/ErrorDisplay";
import menuService from "../../services/menuService";
import { Menu } from "../../models/Menu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

const AdminMenuPage = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const { ErrorDisplay, showError } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await menuService.getMenus()
      if (response.status === 200) {
        setMenus(response.data);
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleAddMenuItem = () => {
    navigate("/admin/menu-items/new");
  };

  const handleEditMenuItem = (id) => {
    navigate(`/admin/menu-items/edit/${id}`);
  };

  const handleDeleteMenuItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        const response = await ApiService.deleteMenu(id);
        if (response.statusCode === 200) {
          fetchMenus();
        }
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="admin-menu-items">
      <ErrorDisplay />
      <div className="content-header">
        <h1>Menu Items Management</h1>
        <button className="add-btn" onClick={handleAddMenuItem}>
          <FontAwesomeIcon icon={faPlus} /> Add Menu Item
        </button>
      </div>

      <div className="menu-items-grid">
        {menus.map((item) => (
          <div className="menu-item-card" key={item.id}>
            <div className="manu-item-image">
              <img src={'http://localhost:8080/'+item.imageUrl} alt={item.name} />
            </div>
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="item-price">${item.price.toFixed(2)}</p>
              <p className="item-description">{item.description}</p>
              <div className="item-footer">
                <span className="reviews-count">
                  {item.reviews?.length || 0} reviews
                </span>
                <div className="item-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditMenuItem(item.id)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMenuItem(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminMenuPage;
