import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

import Chats from "../component/Chats";
import Users from "../component/Users";
import Settings from "../component/Settings";

const Messenger = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  const { id } = useParams();
  console.log(id);

  const [text, setText] = useState("");

  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:3001/message", data);
      const response2 = await axios.post("http://localhost:3001/chats", {
        uid_2: id,
        uid_1: isLoggedIn.id,
        last_message_id: response.data.id,
      });
      setMessages([...messages, data]);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      //   setError(error.message);
    }
  };

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
        <Settings isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
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

  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`http://localhost:3001/chats/${isLoggedIn.id}`).then((res) => {
        console.log("CHATS");
        console.log(res.data);
        setChats(
          res.data.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
          })
        );
      });
    }
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

  return (
    <div>
      <div className="messenger">
        <div className="chats_left">
          {/* <h3>Messenger</h3> */}
          {/* Tabs */}

          <div className="chats_list">
            <Tab
              title={tabs[activeTab].title}
              content={tabs[activeTab].content}
            />

            {/* {users &&
              users.map((user) => (
                <Link to={`/messenger/${user.id}`}>
                  <div
                    className={`chat_item ${user.id == id && "active_chat"}`}
                    key={user.id}
                  >
                    {console.log("user.id", user.id, "id", id)}
                    {user.username}{" "}
                    <div className="txt-secondary">{user.email}</div>
                  </div>
                </Link>
              ))} */}
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
        <div className="chat">
          {/* {console.log("WOOWW")}
          {console.log(users.find((user) => user.id == id).username)} */}
          <div className="chat_header">
            {users.find((user) => user.id == id)?.username}
            <div className="txt-secondary">
              {users.find((user) => user.id == id)?.email}
            </div>
          </div>
          <div className="chat_messages">
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
          </div>
        </div>
      </div>

      <Link to="/login">Login</Link>

      <p>{id}</p>
      <p>{isLoggedIn && isLoggedIn.username}</p>
    </div>
  );
};

export default Messenger;
