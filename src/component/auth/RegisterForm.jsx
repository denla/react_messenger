import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const RegisterForm = () => {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:3001/register", data);
      console.log(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="login_form--top">
        <h2>Create your account</h2>
        <span className="txt-secondary">And start to use or messenger</span>
      </div>

      <input type="text" {...register("username")} placeholder="Username" />
      <input type="email" {...register("email")} placeholder="Email" />
      <input type="password" {...register("password")} placeholder="Password" />
      <button type="submit" className="button-accent">
        Create account
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default RegisterForm;
