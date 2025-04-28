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

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Messenger component is a functional component that manages the state and
 * behavior of a messaging application. It handles user authentication,
 * messaging, and real-time chat functionalities. The component includes tabs
 * for navigating between Chats, Contacts, and Profile sections. It fetches
 * users, messages, and chats from the server, and manages WebSocket connections
 * for real-time updates. The component uses various hooks such as useState,
 * useEffect, useContext, and useNavigate for state management and navigation.
 */

/*******  4057b433-c983-43d4-b8ab-d0daa4cf6d09  *******/
const Messenger = () => {
  const socket = new WebSocket("ws://localhost:8080");

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  const { id } = useParams();
  console.log(id);

  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  // const onSubmit = async (data) => {
  //   try {
  //     const response = await axios.post("http://localhost:3001/message", data);
  //     const response2 = await axios.post("http://localhost:3001/chats", {
  //       uid_2: id,
  //       uid_1: isLoggedIn.id,
  //       last_message_id: response.data.id,
  //     });
  //     setMessages([...messages, data]);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error(error);
  //     //   setError(error.message);
  //   }
  // };

  const [messages, setMessages] = useState([]);

  const [chats, setChats] = useState([]);

  const Test = () => {
    return <h1>hello</h1>;
  };

  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { title: "Chats", content: <Chats chats={chats} setChats={setChats} /> },
    {
      title: "Contacts",
      content: <Users id={id} isLoggedIn={isLoggedIn} users={users} />,
    },
    {
      title: "Profile",
      content: (
        <Settings
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          socket={socket}
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

  // useEffect(() => {
  //   axios.get(`http://localhost:3001/chats/${isLoggedIn.id}`).then((res) => {
  //     console.log("CHATS");
  //     console.log(res.data);
  //     setChats(res.data);
  //   });
  // }, []);

  const Tab = ({ title, content }) => {
    return (
      <div>
        <h2>{title}</h2>
        {content}
      </div>
    );
  };

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
        <div className="chats_left">
          <div className="chats_list">
            <Tab
              title={tabs[activeTab].title}
              content={tabs[activeTab].content}
            />
          </div>

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
        </div>
        <div className="chats_right">
          {activeTab === 2 && <SettingsPage />}
          {activeTab != 2 &&
            (id ? (
              <Chat
                users={users}
                id={id}
                messages={messages}
                setMessages={setMessages}
                fetchChats={fetchChats}
              />
            ) : (
              <EmptyChat />
            ))}

          {/* <div className="chat_header">
            {users.find((user) => user.id == id)?.username}
            <div className="txt-secondary">
              {users.find((user) => user.id == id)?.email}
            </div>
          </div>
          <div className="chat_messages">
            {!id && <p>Select any chat from the list</p>}
            {messages &&
              messages.map((message) => (
                <div className="message">
                  <div
                    className={`message-bubble ${
                      message.id1 == id && "own-bubble"
                    }`}
                    key={message.id}
                  >
                    {message.message}
                  </div>
                  <div className="txt-secondary">
                    {moment(message.created_at).format("DD MMMM, HH:mm")}
                  </div>
                </div>
              ))}
          </div>
          <div className="chat_input">
            <form
              className="chat_form"
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ id1: id, id2: isLoggedIn.id, message: text });
              }}
            >
              <input
                className="w-100"
                type="text"
                onChange={(e) => setText(e.target.value)}
                placeholder="White text"
              />
              <button type="submit">Send</button>
            </form>
          </div> */}
        </div>
      </div>

      <Link to="/login">Login</Link>

      <p>{id}</p>
      <p>{isLoggedIn && isLoggedIn.username}</p>
    </div>
  );
};

export default Messenger;
