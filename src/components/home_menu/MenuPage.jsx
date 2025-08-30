import { useState, useEffect } from "react";
import ApiService from "../../services/ApiService";
import { useNavigate } from "react-router-dom";
import { useError } from "../common/ErrorDisplay";

const MenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = window.location;
  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        let response;
        const urlParams = new URLSearchParams(location.search);
        const categoryId = urlParams.get("category");

        if (categoryId) {
          response = await ApiService.getAllMenuByCategoryId(categoryId);
        } else {
          response = await ApiService.getAllMenus();
        }

        if (response.statusCode === 200) {
          setMenus(response.data);

          console.log(response.data);
          console.log(menus);
        } else {
          showError(response.message);
        }
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    };
    fetchMenus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleSearch = async () => {
    try {
      const response = await ApiService.searchMenu(searchTerm);

      if (response.statusCode === 200) {
        setMenus(response.data);
      } else {
        showError(response.message);
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const filteredMenus = menus.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateToMenuDetails = (id) => {
    navigate(`/menu/${id}`);
  };

  return (
    <div className="menu-page">
      <ErrorDisplay />
      <h1 className="menu-title">Menu</h1>
      <div className="menu-search">
        <input
          type="text"
          placeholder="Search for food ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="menu-search-input"
        />
        <button onClick={handleSearch} className="menu-search-button">
          Search
        </button>
      </div>

      <div className="menu-grid">
        {filteredMenus.map((item) => (
          <div
            className="menu-item-card"
            onClick={() => navigateToMenuDetails(item.id)}
            key={item.id}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="menu-item-image"
            />
            <div className="menu-item-content">
              <h2 className="menu-item-name">{item.name}</h2>
              <p className="menu-item-description">{item.description}</p>
              <p className="menu-item-price">{item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MenuPage;
