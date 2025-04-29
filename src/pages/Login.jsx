import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import axios from "axios";
import { useContext } from "react";

import { AuthContext } from "../AuthContext";

import { useNavigate, Link } from "react-router-dom";

import LoginForm from "../component/auth/LoginForm";
import RegisterForm from "../component/auth/RegisterForm";
import Tab from "../component/Tab";

function Login() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const { register: registerRegister, handleSubmit: handleSubmitRegister } =
    useForm();
  const { register: registerLogin, handleSubmit: handleSubmitLogin } =
    useForm();
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { title: "Login", content: <LoginForm /> },
    {
      title: "Sign up",
      content: <RegisterForm />,
    },
  ];

  return (
    <div>
      <div className="login_form card">
        <div className="menu_tabs">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`menu_tab ${activeTab === index && "active_tab"}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.title}
            </div>
          ))}
        </div>
        <Tab title={tabs[activeTab].title} content={tabs[activeTab].content} />
      </div>
      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
    </div>
  );
}

export default Login;
