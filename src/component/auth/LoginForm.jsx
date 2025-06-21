import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext";

const LoginForm = () => {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleLogin = async (data) => {
    try {
      const response = await axios.post("http://localhost:3001/login", data);
      console.log(response.data);
      setIsLoggedIn(response.data);
      navigate("/messenger");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <div className="login_form--top">
        <h2>Login to your account</h2>
        <span className="txt-secondary">And start to use or messenger</span>
      </div>
      <input
        type="email"
        {...register("email")}
        placeholder="Email"
        className="input--main"
      />
      <input
        type="password"
        {...register("password")}
        placeholder="Password"
        className="input--main"
      />
      <button type="submit " className="button-accent">
        Login
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default LoginForm;
