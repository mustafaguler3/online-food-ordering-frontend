import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useError } from "../common/ErrorDisplay";
import categoryService from "../../services/categoryService";
import menuService from "../../services/menuService";

const AdminMenuFormPage = () => {
  const { id } = useParams();
  const { ErrorDisplay, showError } = useError();
  const navigate = useNavigate();

  const [menu, setMenu] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: "",
    categoryId: "",
    imageFile: null,
  });

  const [categories, setCategories] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchMenu();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //FETCH ALL CATEGORIES
  const fetchCategories = async () => {
    try {
      const response: any = await categoryService.getCategories();
      if (response.statusCode === 200) {
        setCategories(response.data);
      }
    } catch (error:any) {
      showError(error.response?.data?.message || error.message);
    }
  };

  //FETCH MENU BY ID WHEN WE ARE USING THIS FORM TO UPDATE A MENU
  const fetchMenu = async () => {
    try {
      const response: any = await menuService.getMenuById(id);
      if (response.statusCode === 200) {
        setMenu({
          ...response.data,
          price: response.data.price.toString(),
          categoryId: response.data.categoryId.toString(),
        });
      }
    } catch (error:any) {
      showError(error.response?.data?.message || error.message);
    }
  };

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setMenu((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e:any) => {
    setMenu((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (menu.name) formData.append("name", menu.name);
      if (menu.description) formData.append("description", menu.description);
      if (menu.price) formData.append("price", menu.price);
      if (menu.categoryId) formData.append("categoryId", menu.categoryId);
      if (menu.imageFile) formData.append("imageFile", menu.imageFile);

      let response;

      if (id) {
        formData.append("id", id);
        response = await menuService.updateMenu(formData);
      } else {
        response = await menuService.addMenu(formData);
      }

      console.log("RESPONSE IS: " + JSON.stringify(response));

      if (response.statusCode === 200) {
        navigate("/admin/menu-items");
      }
    } catch (error:any) {
      showError(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-menu-item-form">
      <ErrorDisplay />
      <div className="content-header">
        <h1>{id ? "Edit Menu Item" : "Add New Menu Item"}</h1>
        <button
          className="back-btn"
          onClick={() => navigate("/admin/menu-items")}
        >
          Back to Menu Items
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={menu.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={menu.description}
            onChange={handleInputChange}
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={menu.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Category *</label>
            <select
              id="categoryId"
              name="categoryId"
              value={menu.categoryId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="imageFile">
            {id ? "Change Image (Leave blank to keep current)" : "Image *"}
          </label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            onChange={handleFileChange}
            accept="image/*"
            required={!id}
          />
          {id && menu.imageUrl && (
            <div className="current-image-preview">
              <p>Current Image:</p>
              <img
                src={`http://localhost:8080/`+menu.imageUrl}
                alt="Current menu item"
                className="preview-image"
              />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Menu Item"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default AdminMenuFormPage;
