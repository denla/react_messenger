import AvatarUploader from "./AvatarUploader";
import { AuthContext } from "../AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
// import express from "express";

const SettingsPage = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    // try {
    //   const response = await axios.post("http://localhost:3001/register", data);
    //   console.log(response.data);
    // } catch (error) {
    //   setError(error.message);
    // }

    e.preventDefault();
    axios
      .patch(`http://localhost:3001/users/${isLoggedIn.id}`, {
        email: email,
        username: username,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setEmail(isLoggedIn?.email);
    setUsername(isLoggedIn?.username);
    setPassword(isLoggedIn?.password);
  }, []);

  return (
    <>
      <div className="chat_messages flex_w-center">
        <div className="cards_container">
          <h2>Settings</h2>
          <form onSubmit={(e) => onSubmit(e)}>
            {/* <div className="card_title">Avatar</div> */}
            <div className="card">
              <AvatarUploader />
            </div>

            <div className="card_title">Username</div>
            <div className="card">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="card_title">Email</div>
            <div className="card">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="card_title">Bio</div>
            <div className="card">
              <input type="text" placeholder="Enter your bio" />
            </div>

            <div className="card_title">Password</div>
            <div className="card">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
