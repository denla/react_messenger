import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";

const Messenger = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const { id } = useParams();
  console.log(id);

  const [text, setText] = useState("");
  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:3001/message", data);
      setMessages([...messages, data]);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      //   setError(error.message);
    }
  };

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [acitveChat, setActiveChat] = useState(null);

  useEffect(() => {
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

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:3001/users/${id}`)
  //     .then((response) => {
  //       console.log(response.data);
  //       setActiveChat(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, [id]);

  return (
    <div>
      <div className="messenger">
        <div className="chats_list">
          <h3>Messenger</h3>
          {users &&
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
            ))}
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
                <div
                  className={`message-bubble ${
                    message.id1 == id && "own-bubble"
                  }`}
                  key={message.id}
                >
                  {message.message}
                  <div className="txt-secondary">{message.created_at}</div>
                </div>
              ))}
          </div>
          <div className="chat_input">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ id1: id, id2: isLoggedIn.id, message: text });
              }}
            >
              <input
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
