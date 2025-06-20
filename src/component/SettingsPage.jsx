import AvatarUploader from "./AvatarUploader";
import ImageUploader from "./ImageUploader";
import { AuthContext } from "../AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
// import express from "express";

const SettingsPage = ({ settingsTab }) => {
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

  const [selectedColor, setSelectedColor] = useState(0);
  const colors = [
    "#4092f3",
    "#489fbd",
    "#5c0fea",
    "#ea1293",
    "#e99e11",
    "#ebbe10",
    "#12d267",
  ];

  return (
    <>
      <div className="chat_messages flex_w-center">
        <div className="cards_container">
          <h2>Settings</h2>

          {settingsTab == 0 && (
            <form onSubmit={(e) => onSubmit(e)}>
              {/* <div className="card_title">Avatar</div> */}
              <div className="card">
                <AvatarUploader />
                {/* <ImageUploader /> */}
              </div>

              <div className="card_title">Username</div>
              <div className="card card_input">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="txt-secondary input_description">
                Enter your name and add a profile photo
              </div>

              <div className="card_title">Email</div>
              <div className="card card_input">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="card_title">Bio</div>
              <div className="card card_input">
                <input type="text" placeholder="Enter your bio" />
              </div>
              <div className="txt-secondary input_description">
                Enter such as your job title, hobbies, etc. <br></br>This will
                be visible to other users.
              </div>

              <div className="card_title">Password</div>
              <div className="card card_input gap-5">
                <input
                  // type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <hr></hr>
                <input value={password} />
              </div>

              <button type="submit">Save</button>
            </form>
          )}

          {settingsTab == 1 && (
            <>
              {/* <label className="switch">
                <input type="checkbox" />
                <div className="slider"></div>
              </label> */}

              <div className="card card_input gap-5">
                <div className=" toggle-card">
                  <span>Dark mode</span>
                  <label className="switch">
                    <input type="checkbox" />
                    <div className="slider round"></div>
                  </label>
                </div>
                <hr></hr>
                <div className=" toggle-card">
                  <span>Bubble mode</span>
                  <label className="switch">
                    <input type="checkbox" />
                    <div className="slider round"></div>
                  </label>
                </div>
              </div>

              {/* <div className="card toggle-card">
                <span>Bubble mode</span>
                <label className="switch">
                  <input type="checkbox" />
                  <div className="slider round"></div>
                </label>
              </div> */}

              <div className="card_title">Colors</div>
              <div className="card">
                <div className="colors">
                  {colors.map((color, i) => (
                    <div
                      className={`color_badge ${
                        selectedColor == i && "selected_color"
                      }`}
                      onClick={() => setSelectedColor(i)}
                      key={i}
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
