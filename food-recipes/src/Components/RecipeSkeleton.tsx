import "./RecipeSkeleton.css";

const RecipeSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-meal" />
      <div className="skeleton-btn-container">
        <div className="skeleton skeleton-btn" />
        <div className="skeleton skeleton-btn" />
      </div>

    </div>
  );
};

export default RecipeSkeleton;
