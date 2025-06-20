import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const tabs = ["Home", "Settings"];

export default function TabSwitcher() {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex space-x-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative h-60 overflow-hidden border rounded-lg bg-white">
        <AnimatePresence mode="wait">
          {activeTab === "Home" && (
            <motion.div
              key="home"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-4"
            >
              <h2 className="text-xl font-bold">Home</h2>
              <p>Welcome to the home tab!</p>
            </motion.div>
          )}

          {activeTab === "Settings" && (
            <motion.div
              key="settings"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-4"
            >
              <h2 className="text-xl font-bold">Settings</h2>
              <p>Here are your settings.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
