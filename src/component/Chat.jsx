import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const Chat = ({ users, id, messages, setMessages }) => {
  const [text, setText] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
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

  return (
    <div className="chat">
      <div className="chat_header">
        <div className="chat_header--info">
          <div
            className="a-36"
            style={{
              backgroundImage: `url(http://localhost:3001/${
                users.find((user) => user.id == id)?.avatar_path
              })`,
            }}
          ></div>
          <div className="chat_header--text">
            {users.find((user) => user.id == id)?.username}
            <div className="txt-secondary">
              {users.find((user) => user.id == id)?.email}
            </div>
          </div>
        </div>
        <Link to="/messenger">
          <button className="btn-secondary">Close</button>
        </Link>
      </div>
      <div className="chat_messages flex-end">
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
      </div>
    </div>
  );
};

export default Chat;
