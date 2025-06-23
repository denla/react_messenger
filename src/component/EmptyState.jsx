import react from "react";

const EmptyState = ({ title, emoji }) => {
  return (
    <div className="empty_state">
      <div className="empty_state--emoji">{emoji}</div>
      <div className="empty_state--title">{title}</div>
    </div>
  );
};

export default EmptyState;
