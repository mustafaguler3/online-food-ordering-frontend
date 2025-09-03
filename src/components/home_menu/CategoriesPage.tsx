import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useError } from "../common/ErrorDisplay";
import ApiService from "../../services/ApiService";
import categoryService from "../../services/categoryService";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories()
        if (response.status === 200) {
          setCategories(response.data);
        } else {
          showError(response);
        }
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    };
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/menu?category=${categoryId}`);
  };

  return (
    <div className="categories-page">
      <ErrorDisplay />
      <h1 className="categories-title">Categories</h1>
      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => handleCategoryClick(category.id)}
          >
            <h2 className="category-name">{category.name}</h2>
            <p className="category-description">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CategoriesPage;
