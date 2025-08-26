import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { useError } from "../common/ErrorDisplay";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const { ErrorDisplay, showError } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await ApiService.getAllCategories();
      if (response.statusCode === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleAddCategory = () => {
    navigate("/admin/categories/new");
  };

  const handleEditCategory = (id) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await ApiService.deleteCategory(id);
        if (response.statusCode === 200) {
          fetchCategories();
        }
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="admin-categories">
      <ErrorDisplay />
      <div className="content-header">
        <h1>Categories Management</h1>
        <button className="add-btn" onClick={handleAddCategory}>
          <i className="fas fa-plus"></i> Add Category
        </button>
      </div>

      <div className="categories-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditCategory(category.id)}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminCategoriesPage;
