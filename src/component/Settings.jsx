import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SettingsPage from "./SettingsPage";
import axios from "axios";
import moment from "moment";
const Settings = ({ isLoggedIn, setIsLoggedIn, socket }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [avatar, setAvatar] = useState("");

  const tabs = [
    { title: "Profile", content: <SettingsPage /> },
    { title: "Security", content: <SettingsPage /> },
    { title: "Appearance", content: <SettingsPage /> },
  ];

  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`http://localhost:3001/avatar/${isLoggedIn.id}`).then((res) => {
        setAvatar(res.data[res.data?.length - 1]?.avatar_path);
        console.log(res.data[res.data?.length - 1]?.avatar_path);
      });
    }
  }, []);

  return (
    <>
      <div className="settings_profile">
        <div
          className="a-120"
          style={{ backgroundImage: `url(http://localhost:3001/${avatar})` }}
        ></div>
        <h2>{isLoggedIn?.username}</h2>
        <div className="txt-secondary">
          last seen{" "}
          {moment(isLoggedIn?.updated_at)
            .format("DD MMMM, HH:mm")
            .toLocaleLowerCase()}
        </div>

        {isLoggedIn?.email}
        <br />
        {isLoggedIn?.id}
        <button
          onClick={() => {
            setIsLoggedIn();
            navigate("/login");
            socket.send(
              JSON.stringify({ type: "logout", userId: isLoggedIn?.id })
            );
          }}
        >
          Logout
        </button>
      </div>

      <br></br>

      {tabs.map((tab, i) => (
        <div
          className={`chat_item ${activeTab == i && "active_chat"}`}
          key={i}
          onClick={() => setActiveTab(i)}
        >
          {tab.title}
        </div>
      ))}
    </>
  );
};

export default Settings;
