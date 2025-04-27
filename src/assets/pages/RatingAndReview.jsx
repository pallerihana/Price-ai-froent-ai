import React, { useState, useCallback } from "react";
import { FaStar } from "react-icons/fa";

const RatingAndReview = () => {
  // Data
  const initialReviews = [
    { id: 1, name: "Palle Anil", text: "Good Service" },
    { id: 2, name: "Nagendra", text: "Average" },
    { id: 3, name: "Pavan Manikanta", text: "Worth for cost" },
    { id: 4, name: "Jayanth", text: "Not bad" },
  ];

  const ratingBreakdown = [
    { stars: 5, count: 5512, color: "#4CAF50" },
    { stars: 4, count: 2085, color: "#8BC34A" },
    { stars: 3, count: 464, color: "#FFC107" },
    { stars: 2, count: 173, color: "#FF9800" },
    { stars: 1, count: 431, color: "#F44336" },
  ];

  const categories = [
    { name: "Services", rating: 4.9 },
    { name: "Maintenance", rating: 3.8 },
    { name: "Billing", rating: 4.6 },
    { name: "Worth of Cost", rating: 3.7 },
  ];

  // State
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState(initialReviews);
  const totalRatings = ratingBreakdown.reduce((sum, r) => sum + r.count, 0);

  // Handlers
  const handleSubmit = useCallback(() => {
    if (comment.trim()) {
      setReviews(prev => [...prev, { 
        id: Date.now(), 
        name: "You", 
        text: comment 
      }]);
      setComment("");
    }
  }, [comment]);

  // Components
  const RatingBar = ({ stars, count, color, total }) => {
    const percent = (count / total) * 100;
    return (
      <div className="rating-bar">
        <span>{stars}★</span>
        <div className="bar-container">
          <div 
            className="bar-fill" 
            style={{ width: `${percent}%`, backgroundColor: color }}
            aria-label={`${percent.toFixed(1)}% of ratings are ${stars} stars`}
          />
        </div>
        <span className="count">{count.toLocaleString()}</span>
      </div>
    );
  };

  const CategoryRating = ({ name, rating }) => (
    <div className="category-rating">
      <div className="rating-circle">
        <span>{rating}</span>
      </div>
      <div>{name}</div>
    </div>
  );

  const ReviewItem = ({ name, text }) => (
    <div className="review-item">
      <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`}
        alt={`${name}'s avatar`}
        className="avatar"
        loading="lazy"
      />
      <div>
        <strong>{name}</strong>
        <p>{text}</p>
      </div>
    </div>
  );

  return (
    <div className="rating-review-container">
      {/* Ratings Panel */}
      <div className="panel ratings-panel">
        <h2 className="panel-title">Hospital Rating 🏥</h2>
        
        <div className="overall-rating">
          <div className="rating-value">
            <span>4.4</span>
            <FaStar className="star-icon" />
          </div>
          <span className="rating-count">{totalRatings.toLocaleString()} Ratings</span>
        </div>

        <div className="rating-distribution">
          {ratingBreakdown.map((item) => (
            <RatingBar 
              key={item.stars}
              stars={item.stars}
              count={item.count}
              color={item.color}
              total={totalRatings}
            />
          ))}
        </div>

        <div className="category-ratings">
          {categories.map((category) => (
            <CategoryRating 
              key={category.name}
              name={category.name}
              rating={category.rating}
            />
          ))}
        </div>
      </div>

      {/* Reviews Panel */}
      <div className="panel reviews-panel">
        <h2 className="panel-title">User Reviews</h2>
        
        <div className="reviews-list">
          {reviews.map((review) => (
            <ReviewItem 
              key={review.id}
              name={review.name}
              text={review.text}
            />
          ))}
        </div>

        <div className="review-form">
          <input
            type="text"
            placeholder="Enter Comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="comment-input"
            aria-label="Add your review"
          />
          <button 
            className="submit-button"
            onClick={handleSubmit}
            disabled={!comment.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
  .rating-review-container {
    display: flex;
    gap: 20px;
    padding: 20px;
    width: 100%px;
    margin: 0 auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
  }

  .panel {
    
    width: 755px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }

  .panel-title {
    margin: 0 0 15px 0;
    font-size: 1.5rem;
    color: #2c3e50;
  }

  /* Ratings Panel Styles */
  .overall-rating {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .rating-value {
    display: flex;
    align-items: center;
    font-size: 2rem;
    font-weight: bold;
  }

  .star-icon {
    color: #FFD700;
    margin-left: 5px;
    font-size: 1.5rem;
  }

  .rating-count {
    color: #666;
    font-size: 0.9rem;
  }

  .rating-distribution {
    margin-bottom: 25px;
  }

  .rating-bar {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 0.9rem;
  }

  .bar-container {
    flex: 1;
    height: 8px;
    background-color: #f0f0f0;
    margin: 0 10px;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    transition: width 0.3s ease;
  }

  .count {
    min-width: 40px;
    text-align: right;
  }

  .category-ratings {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 15px;
  }

  .category-rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 80px;
  }

  .rating-circle {
    width: 50px;
    height: 50px;
    border: 4px solid #4CAF50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 5px;
  }

  /* Reviews Panel Styles */
  .reviews-list {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 15px;
    padding-right: 10px;
  }

  .review-item {
    display: flex;
    gap: 12px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .review-form {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }

  .comment-input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
    transition: border-color 0.2s;
  }

  .comment-input:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }

  .submit-button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .submit-button:hover {
    background-color: #3e8e41;
  }

  .submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .rating-review-container {
      flex-direction: column;
    }
    
    .panel {
      width: 100%;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default RatingAndReview;