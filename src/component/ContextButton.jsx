import React, { useState, useEffect } from "react";

const ContextButton = ({ list }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = (event) => {
    if (
      !event.target.closest(".context_menu") &&
      !event.target.closest(".context_button")
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className="context_menu"
        style={{ display: isOpen ? "block" : "none" }}
      >
        {list.map((item, i) => (
          <div className="context_menu--item" key={i} onClick={item.onClick}>
            {item.title}
          </div>
        ))}
      </div>
      <button className="context_button" onClick={() => setIsOpen(!isOpen)}>
        ···
      </button>
    </>
  );
};

export default ContextButton;
