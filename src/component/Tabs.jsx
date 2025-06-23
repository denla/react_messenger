import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div
        className="menu_tabs gray_tabs"
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
                  borderRadius: "50px",
                  backgroundColor: "rgb(255 255 255)",
                  zIndex: -1,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          style={{ overflow: "hidden" }}
        >
          {tabs[activeTab].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Tabs;
