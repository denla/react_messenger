import AvatarUploader from "./settings/AvatarUploader";
import ImageUploader from "./ImageUploader";
import { AuthContext } from "../AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import ProfileSettings from "./settings/ProfileSettings";
import PrivacySettings from "./settings/PrivacySettings";
// import express from "express";

const SettingsPage = ({ settingsTab }) => {
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
      <div className="chat_messages flex_w-center bg-gray ">
        <div className="cards_container">
          <h2>Settings</h2>

          {settingsTab == 0 && (
            <ProfileSettings />
            // <form onSubmit={(e) => onSubmit(e)}>
            //   {/* <div className="card_title">Avatar</div> */}
            //   <div className="card">
            //     <AvatarUploader isLoggedIn={isLoggedIn} />
            //     {/* <ImageUploader /> */}
            //   </div>

            //   <div className="card_title">Username</div>
            //   <div className="card card_input">
            //     <input
            //       type="text"
            //       value={username}
            //       onChange={(e) => setUsername(e.target.value)}
            //     />
            //   </div>
            //   <div className="txt-secondary input_description">
            //     Enter your name and add a profile photo
            //   </div>

            //   <div className="card_title">Email</div>
            //   <div className="card card_input">
            //     <input
            //       type="text"
            //       value={email}
            //       onChange={(e) => setEmail(e.target.value)}
            //     />
            //   </div>

            //   <div className="card_title">Bio</div>
            //   <div className="card card_input">
            //     <input type="text" placeholder="Enter your bio" />
            //   </div>
            //   <div className="txt-secondary input_description">
            //     Enter such as your job title, hobbies, etc. <br></br>This will
            //     be visible to other users.
            //   </div>

            //   <div className="card_title">Password</div>
            //   <div className="card card_input gap-5">
            //     <input
            //       type="password"
            //       value={password}
            //       onChange={(e) => setPassword(e.target.value)}
            //     />
            //     <hr></hr>
            //     <input type="password" value={password} />
            //   </div>

            //   <button type="submit">Save</button>
            // </form>
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

          {settingsTab == 2 && <PrivacySettings />}
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
