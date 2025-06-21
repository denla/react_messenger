import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

import { useNavigate, Link } from "react-router-dom";

import LoginForm from "../component/auth/LoginForm";
import RegisterForm from "../component/auth/RegisterForm";
import Tabs from "../component/Tabs";

import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
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
    <div className="login_bg">
      <motion.div
        className="login_form card"
        layout
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Tabs tabs={tabs} />
      </motion.div>
    </div>
  );
}

export default Login;
