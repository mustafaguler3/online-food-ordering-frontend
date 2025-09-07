import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useError } from "../common/ErrorDisplay";
import categoryService from "../../services/categoryService";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: any = await categoryService.getCategories();
        if (response.statusCode === 200) {
          setCategories(response.data);
        } else {
          showError(response);
        }
      } catch (error: any) {
        showError(error.response?.data?.message || error.message);
      }
    };
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/menus?categoryId=${categoryId}`);
  };

  return (
    <div className="categories-container">
      <ErrorDisplay />
      <h1 className="categories-title">Browse Categories</h1>

      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="category-card-content">
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stil */}
      <style>{`
        .categories-container {
          max-width: 1200px;
          margin: 50px auto;
          padding: 0 20px;
        }

        .categories-title {
          text-align: center;
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 40px;
          color: #333;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 25px;
        }

        .category-card {
          background: #fff;
          border-radius: 12px;
          padding: 30px 20px;
          text-align: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
          border: 1px solid #eee;
        }

        .category-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
          border-color: #1976d2;
        }

        .category-card-content h2 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: #1976d2;
        }

        .category-card-content p {
          font-size: 0.95rem;
          color: #555;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default CategoriesPage;