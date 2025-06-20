import React, { useState } from "react";
import { motion } from "framer-motion";

const Tab = ({ title, content }) => (
  <div style={{ padding: "1rem" }}>
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { title: "Таб 1", content: "Содержимое таба 1" },
    { title: "Таб 2", content: "Содержимое таба 2" },
    { title: "Таб 3", content: "Содержимое таба 3" },
  ];

  return (
    <div>
      <div
        className="menu_tabs navigate"
        style={{ display: "flex", gap: "0.5rem", position: "relative" }}
      >
        {tabs.map((tab, index) => (
          <div
            key={index}
            className="menu_tab"
            onClick={() => setActiveTab(index)}
            style={{
              position: "relative",
              cursor: "pointer",
              padding: "0.5rem 1rem",
              userSelect: "none",
              fontWeight: activeTab === index ? "600" : "400",
              zIndex: 1,
            }}
          >
            {tab.title}
            {activeTab === index && (
              <motion.div
                layoutId="tab-bg"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: "8px",
                  backgroundColor: "rgb(232 232 232)",
                  zIndex: -1,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </div>
        ))}
      </div>

      <Tab title={tabs[activeTab].title} content={tabs[activeTab].content} />
    </div>
  );
};

export default Tabs;
