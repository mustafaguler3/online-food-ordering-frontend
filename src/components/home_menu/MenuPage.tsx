
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useError } from "../common/ErrorDisplay";
import menuService from "../../services/menuService";
import { Rating, Stack, Typography } from "@mui/material";

const MenuPage = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = window.location;
  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const categoryId = urlParams.get("categoryId");
        const search = urlParams.get("search");

        let response;
        if (categoryId || search) {
          response = await menuService.getAllMenuByCategoryId(
            categoryId,
            search,
          );
        } else {
          response = await menuService.getMenus();
        }

        if (response.statusCode === 200) {
          setMenus(response.data);
        } else {
          showError(response.message);
        }
      } catch (error: any) {
        showError(error.response?.data?.message || error.message);
      }
    };

    fetchMenus();
  }, [location.search]);

  const filteredMenus = menus.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="menu-container">
      <ErrorDisplay />
      <h2 className="menu-title">Explore Our Menu</h2>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for your favorite food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="menu-grid">
        {filteredMenus.map((item) => (
          <div
            className="menu-card"
            key={item.id}
            onClick={() => navigate(`/menus/${item.id}`)}
          >
            <img
              src={`http://localhost:8081/uploads/menu/` + item.imageUrl}
              alt={item.name}
              className="menu-img"
            />
            <div className="menu-content">
              <h3>{item.name}</h3>
              <p className="desc">{item.description}</p>
              <div className="card-footer">
                <span className="price">${item.price.toFixed(2)}</span>
                {/* Rating göster */}

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ mt: 1 }}
                >
                  <Rating
                    name={`menu-rating-${item.id}`}
                    value={item.averageRating}
                    precision={0.1}
                    readOnly
                    sx={{ color: "#FFD700" }}
                  />
                  <Typography variant="body2">
                    {item.averageRating.toFixed(1)}
                  </Typography>
                </Stack>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stil */}
      <style>{`
        .menu-container {
          max-width: 1200px;
          margin: 50px auto;
          padding: 0 20px;
        }
        .menu-title {
          text-align: center;
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 30px;
        }
        .search-box {
          text-align: center;
          margin-bottom: 40px;
        }
        .search-box input {
          width: 60%;
          padding: 12px 16px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          outline: none;
          transition: 0.3s;
        }
        .search-box input:focus {
          border-color: #1976d2;
          box-shadow: 0 0 6px rgba(25, 118, 210, 0.3);
        }
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }
        .menu-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .menu-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .menu-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .menu-content {
          padding: 16px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .menu-content h3 {
          margin: 0 0 10px 0;
          font-size: 1.2rem;
          font-weight: bold;
        }
        .menu-content .desc {
          flex: 1;
          font-size: 0.9rem;
          color: #555;
          margin-bottom: 12px;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .price {
          font-size: 1.1rem;
          font-weight: bold;
          color: #1976d2;
        }
        .rating {
          font-size: 0.9rem;
          color: #f57c00;
        }
      `}</style>
    </div>
  );
};

export default MenuPage;
