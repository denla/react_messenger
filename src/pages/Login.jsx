import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import axios from "axios";
import { useContext } from "react";

import { AuthContext } from "../AuthContext";

import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  //   const [isLoggedIn, setIsLoggedIn] = useState();

  const { register: registerRegister, handleSubmit: handleSubmitRegister } =
    useForm();
  const { register: registerLogin, handleSubmit: handleSubmitLogin } =
    useForm();
  const [error, setError] = useState(null);

  // const { register, handleSubmit } = useForm();
  // const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:3001/register", data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async (data) => {
    try {
      const response = await axios.post("http://localhost:3001/login", data);
      console.log(response.data);
      setIsLoggedIn(response.data);
      navigate("/messenger/1234");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <Link to="/messenger/1">Messenger</Link>
      <h1>Логин</h1>
      {isLoggedIn && (
        <>
          <p>Вы авторизованы</p>
          {isLoggedIn.username}
          <button onClick={() => setIsLoggedIn(null)}>Выход</button>
        </>
      )}

      <h1>Регистрация</h1>
      <form onSubmit={handleSubmitRegister(onSubmit)}>
        <input
          type="text"
          {...registerRegister("username")}
          placeholder="Username"
        />
        <input
          type="email"
          {...registerRegister("email")}
          placeholder="Email"
        />
        <input
          type="password"
          {...registerRegister("password")}
          placeholder="Password"
        />
        <button type="submit">Регистрация</button>
      </form>

      <form onSubmit={handleSubmitLogin(handleLogin)}>
        <input type="email" {...registerLogin("email")} placeholder="Email" />
        <input
          type="password"
          {...registerLogin("password")}
          placeholder="Password"
        />
        <button type="submit">Авторизация</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
