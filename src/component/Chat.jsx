import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";
import ContextButton from "./ContextButton";
import { set } from "react-hook-form";

const Chat = ({ users, id, messages, setMessages, fetchChats }) => {
  const [text, setText] = useState("");
  const [postText, setPostText] = useState("");

  const [profileOpened, setProfileOpened] = useState(false);
  const [emojiOpened, setEmojiOpened] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [contacts, setContacts] = useState(false);
  const [avatars, setAvatars] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log("AVATARS");
    console.log(avatars);
  }, [avatars]);

  const onEmojiClick = (event, emoji) => {
    setText(text + emoji);
  };

  const addToContacts = async (contact_id) => {
    try {
      setContacts(!contacts);
      const response = await axios.post("http://localhost:3001/contacts", {
        user_id: isLoggedIn.id,
        contact_id: contact_id,
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
      //   setError(error.message);
    }
  };

  useEffect(() => {
    const data = {
      user_id: isLoggedIn.id,
      contact_id: id,
    };
    console.log("CONTACTS");
    axios
      .get(`http://localhost:3001/contacts/${data.user_id}/${data.contact_id}`)
      .then((res) => {
        setContacts(res.data);
        console.log("CONTACTS");
        console.log(res.data);
      });
  }, [id]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:3001/message", data);
      const response2 = await axios.post("http://localhost:3001/chats", {
        uid_2: id,
        uid_1: isLoggedIn.id,
        last_message_id: response.data.id,
      });
      setMessages([...messages, data]);
      fetchChats();
      console.log(response.data);
    } catch (error) {
      console.error(error);
      //   setError(error.message);
    }
  };

  const onSendPost = async (data) => {
    try {
      const response = await axios.post("http://localhost:3001/posts", data);
      // setPosts(response.data);
    } catch (error) {
      console.error(error);
      //   setError(error.message);
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/${id}`).then((res) => {
      console.log(res.data);
      setPosts(res.data);
    });
  }, [id]);

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

  useEffect(() => {
    console.log("AVATARS");
    console.log(id);
    console.log("--------");
    axios.get(`http://localhost:3001/avatars/${id}`).then((res) => {
      console.log(res.data);
      setAvatars(res.data);
    });
  }, [id]);

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
                <div className="flex_w-center">
                  <button onClick={() => setProfileOpened(false)}>
                    Send message
                  </button>

                  <button onClick={() => addToContacts(id)}>
                    {contacts ? "Remove from contacts" : "Add to contacts"}
                  </button>
                </div>
              </div>

              <div className="card_title">Avatars</div>
              <div className="card">
                <div className="profile_photos">
                  {avatars.map((photo) => (
                    <div
                      key2={photo.id}
                      user_id={photo.user_id}
                      className="profile_photos--item"
                      style={{
                        backgroundImage: `url(http://localhost:3001/${photo.avatar_path})`,
                      }}
                    ></div>
                  ))}
                  {/* <div className="profile_photos--item"> </div>
                  <div className="profile_photos--item"> </div>
                  <div className="profile_photos--item"> </div>
                  <div className="profile_photos--item"> </div>
                  <div className="profile_photos--item"> </div> */}
                </div>
              </div>

              <div className="card_title">Posts</div>
              <div className="card">
                <form
                  className="chat_form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSendPost({ user_id: isLoggedIn.id, text: postText });
                  }}
                >
                  <input
                    className="w-100"
                    type="text"
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="Write text"
                  />
                  <button type="submit">Send</button>
                </form>
              </div>
              {/* <div className="card">No posts here</div> */}
              {posts.map((post) => (
                <div className="card">
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
                        {moment(post.created_at).format("DD MMMM, HH:mm")}
                      </div>
                    </div>
                  </div>

                  {post.text}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="chat_messages flex-end">
            {!id && <p>Select any chat from the list</p>}
            {messages.length ? (
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
                  <div className="message_info">
                    <ContextButton
                      list={[
                        {
                          title: "Delete",
                          onClick: () => removeMessage(message.id),
                        },
                      ]}
                    />
                    <div className="txt-secondary">
                      {moment(message.created_at).format("DD MMMM, HH:mm")}
                    </div>
                    {/* <div
                      className="online"
                      onClick={() => {
                        removeMessage(message.id);
                      }}
                    >
                      Remove
                    </div> */}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex_center" style={{ height: "100%" }}>
                <span className="txt-secondary">No messages here</span>
              </div>
            )}
          </div>
          <div className="chat_input">
            <button onClick={() => setEmojiOpened(!emojiOpened)}>Emoji</button>
            <div
              className="emoji_picker"
              style={{ display: emojiOpened ? "block" : "none" }}
            >
              <EmojiPicker searchDisabled={true} onEmojiClick={onEmojiClick} />
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
