import React, { useState } from "react";

const Tab = ({ title, content }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
};

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { title: "Таб 1", content: "Содержимое таба 1" },
    { title: "Таб 2", content: "Содержимое таба 2" },
    { title: "Таб 3", content: "Содержимое таба 3" },
  ];

  return (
    <div>
      <ul>
        {tabs.map((tab, index) => (
          <li key={index}>
            <button onClick={() => setActiveTab(index)}>{tab.title}</button>
          </li>
        ))}
      </ul>
      <Tab title={tabs[activeTab].title} content={tabs[activeTab].content} />
    </div>
  );
};
