import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import Chats from "../component/Chats";
import Chat from "../component/Chat";
import EmptyChat from "../component/EmptyChat";
import Users from "../component/Users";
import Settings from "../component/Settings";
import SettingsPage from "../component/SettingsPage";
import Tab from "../component/Tab";

/*FRAMER */
import { AnimatePresence, motion } from "framer-motion";
import TabSwitcher from "../component/Framer";

/* Icons */
import chats_icon from "../sources/icons/chats.svg";
import contacts_icon from "../sources/icons/contacts.svg";
import settings_icon from "../sources/icons/settings.svg";

const Messenger = () => {
  const [openedMenu, setOpenedMenu] = useState(true);
  const socket = new WebSocket("ws://localhost:8080");

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);

  const [activeTab, setActiveTab] = useState(0);
  const [settingsTab, setSettingsTab] = useState(0);

  const settingsTabs = [{ title: "Account settings" }, { title: "Appearance" }];

  const tabs = [
    {
      title: "Chats",
      icon: chats_icon,
      content: (
        <Chats
          chats={chats}
          setChats={setChats}
          openedMenu={openedMenu}
          setOpenedMenu={setOpenedMenu}
          isMobile={isMobile}
        />
      ),
    },
    {
      title: "People",
      icon: contacts_icon,
      content: (
        <Users
          id={id}
          isLoggedIn={isLoggedIn}
          users={users}
          setOpenedMenu={setOpenedMenu}
          isMobile={isMobile}
        />
      ),
    },
    {
      title: "Profile",
      icon: settings_icon,
      content: (
        <Settings
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          socket={socket}
          setSettingsTab={setSettingsTab}
          settingsTab={settingsTab}
          settingsTabs={settingsTabs}
        />
      ),
    },
  ];

  useEffect(() => {
    if (isLoggedIn && id) {
      axios
        .get("http://localhost:3001/message", {
          params: {
            id1: id,
            id2: isLoggedIn.id,
          },
        })
        .then((response) => {
          console.log(response.data);
          setMessages(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/users")
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const fetchChats = async () => {
    if (isLoggedIn) {
      const response = await axios.get(
        `http://localhost:3001/chats/${isLoggedIn.id}`
      );
      console.log("CHATS");
      console.log(response.data);
      setChats(
        response.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        })
      );
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // WebSocket
  socket.onopen = () => {
    console.log("Соединение установлено");
    socket.send(JSON.stringify({ type: "login", userId: isLoggedIn?.id }));
  };

  window.addEventListener("beforeunload", () => {
    socket.send(JSON.stringify({ type: "logout", userId: isLoggedIn?.id }));
  });

  // // Когда пользователь логинится, отправляем сообщение о подключении на сервер
  // socket.send("login");
  // // // Когда пользователь выходит из системы, отправляем сообщение о отключении на сервер
  // socket.send("logout");

  return (
    <div>
      <div className="messenger">
        {openedMenu && (
          <div className="chats_left">
            <div className="chats_list">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  {tabs[activeTab].content}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className=" nav_tabs">
              {tabs.map((tab, index) => (
                <div
                  className={`nav_tabs--tab ${
                    activeTab === index && "nav_tabs--tab-active"
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  <img src={tab.icon} />
                  <span>{tab.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className={`chats_right ${openedMenu && isMobile && "display-none"}`}
        >
          {activeTab === 2 && <SettingsPage settingsTab={settingsTab} />}

          {activeTab != 2 &&
            (id ? (
              <Chat
                users={users}
                id={id}
                messages={messages}
                setMessages={setMessages}
                fetchChats={fetchChats}
                openedMenu={openedMenu}
                setOpenedMenu={setOpenedMenu}
                isMobile={isMobile}
              />
            ) : (
              <EmptyChat />
            ))}
        </div>
        {/* </motion.div>
        </AnimatePresence> */}
      </div>
    </div>
  );
};

export default Messenger;
