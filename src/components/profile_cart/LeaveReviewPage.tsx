import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useError } from "../common/ErrorDisplay";
import menuService from "../../services/menuService";
import reviewService from "../../services/reviewService";

const LeaveReviewPage = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const menuId = urlParams.get("menuId");
  const orderId = urlParams.get("orderId");

  const navigate = useNavigate();
  const { ErrorDisplay, showError } = useError();

  const [menu, setMenu] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response: any = await menuService.getMenuById(menuId);
        if (response.statusCode === 200) {
          setMenu(response.data);
        }
      } catch (error) {
        showError(error.response?.data?.message || error.message);
      }
    };

    if (menuId) {
      fetchMenu();
    } else {
      showError("No Menu Item specified");
    }
  }, [menuId,showError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const reviewData = {
        menuId,
        orderId,
        rating,
        comment,
      };
      const response: any = await reviewService.createReview(reviewData);

      if (response.statusCode === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      }
    } catch (error) {
      showError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="leave-review-container">
      <div className="review-header">
        <h1>Leave a Review</h1>
        {menu && (
          <div className="menu-item-info">
            <img
              src={menu.imageUrl}
              alt={menu.name}
              className="menu-item-image-review"
            />
            <h2>{menu.name}</h2>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        <div className="rating-section">
          <label>Your Rating:</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? "filled" : ""}`}
                onClick={() => setRating(star)}
                onMouseEnter={() =>
                  document.activeElement === document.body && setRating(star)
                }
              >
                ★
              </span>
            ))}
          </div>
          <div className="rating-value">{rating} out of 10</div>
        </div>

        <div className="comment-section">
          <label htmlFor="comment">Your Review:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this dish..."
            required
          />
        </div>
        <ErrorDisplay />
        {success && (
          <div className="form-success">
            Review submitted successfully! Redirecting back...
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={rating === 0}
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};
export default LeaveReviewPage;
