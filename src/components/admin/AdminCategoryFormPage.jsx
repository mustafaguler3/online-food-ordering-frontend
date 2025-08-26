import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { useError } from "../common/ErrorDisplay";

const AdminCategoryFormPage = () => {
  const { id } = useParams();

  const { ErrorDisplay, showError } = useError();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await ApiService.getCategoryById(id);
      if (response.statusCode === 200) {
        setCategory(response.data);
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (id) {
        response = await ApiService.updateCategory({ id, ...category });
      } else {
        response = await ApiService.createCategory(category);
      }
      if (response.statusCode === 200) {
        navigate("/admin/categories");
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="admin-category-form">
      <ErrorDisplay />
      <div className="content-header">
        <h1>{id ? "Edit Category" : "Add New Category"}</h1>
        <button
          className="back-btn"
          onClick={() => navigate("/admin/categories")}
        >
          Back to Categories
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Category Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={category.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={category.description}
            onChange={handleInputChange}
            rows="4"
          />
        </div>

        <div className="form-actions">
          {id ? (
            <button type="submit" className="save-btn">
              Update Category
            </button>
          ) : (
            <button type="submit" className="save-btn">
              Save Category
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
export default AdminCategoryFormPage;
