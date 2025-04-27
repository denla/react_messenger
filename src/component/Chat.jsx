import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";

const Chat = ({ users, id, messages, setMessages }) => {
  const [text, setText] = useState("");
  const [profileOpened, setProfileOpened] = useState(false);
  const [emojiOpened, setEmojiOpened] = useState(false);
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

  const removeMessage = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/message/${id}`
      );
      setMessages(messages.filter((message) => message.id !== id));
      console.log(response.data);
    } catch (error) {
      console.error(error);
      //   setError(error.message);
    }
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <div
          className="chat_header--info"
          onClick={() => setProfileOpened(true)}
        >
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

      {profileOpened ? (
        <>
          <div className="chat_messages flex_w-center">
            <div className="cards_container">
              <div className="flex_w-center flex-column chat_profile card">
                <div
                  className="a-120"
                  style={{
                    backgroundImage: `url(http://localhost:3001/${
                      users.find((user) => user.id == id)?.avatar_path
                    })`,
                  }}
                ></div>
                <h2>{users.find((user) => user.id == id)?.username}</h2>
                <div className="txt-secondary">
                  {users.find((user) => user.id == id)?.online ? (
                    <div className="online">online</div>
                  ) : (
                    <div className="txt-secondary">
                      last seen{" "}
                      {moment(users.find((user) => user.id == id)?.updated_at)
                        .format("DD MMMM, HH:mm")
                        .toLocaleLowerCase()}
                    </div>
                  )}
                </div>

                {/* {users.find((user) => user.id == id)?.email} */}
                <button onClick={() => setProfileOpened(false)}>
                  Send message
                </button>
              </div>

              <div className="card_title">Posts</div>
              <div className="card">No posts here</div>
            </div>
          </div>
        </>
      ) : (
        <>
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
                  <div>
                    <div className="txt-secondary">
                      {moment(message.created_at).format("DD MMMM, HH:mm")}
                    </div>
                    <div
                      className="online"
                      onClick={() => {
                        removeMessage(message.id);
                      }}
                    >
                      Remove
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="chat_input">
            <button onClick={() => setEmojiOpened(!emojiOpened)}>Emoji</button>
            <div
              className="emoji_picker"
              style={{ display: emojiOpened ? "block" : "none" }}
            >
              <EmojiPicker searchDisabled={true} />
            </div>
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
        </>
      )}
    </div>
  );
};

export default Chat;
