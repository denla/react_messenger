import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import EmojiPicker from "emoji-picker-react";
import ContextButton from "./ContextButton";
import { set } from "react-hook-form";
import ImageUploader from "./ImageUploader";

import Avatar from "./Avatar";

import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import ChatInput from "./chat/ChatInput";

/*icons*/

import back_icon from "../sources/icons/back_icon.svg";
import close_icon from "../sources/icons/close_icon.svg";
import emoji_icon from "../sources/icons/emoji_icon.svg";
import send_icon from "../sources/icons/send_icon.svg";
import menu_icon from "../sources/icons/menu_icon.svg";

/*framer-motion*/
import { AnimatePresence, motion } from "framer-motion";
import ProfilePage from "./chat/ProfilePage";

const Chat = ({
  users,
  id,
  messages,
  setMessages,
  fetchChats,
  openedMenu,
  setOpenedMenu,
  isMobile,
  typingUsers,
  onUserTyping,
}) => {
  const [profileOpened, setProfileOpened] = useState(false);
  const [emojiOpened, setEmojiOpened] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [contacts, setContacts] = useState(false);

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

  function isEmoji(str) {
    return (
      (str === "❤️" || /^\p{Emoji}+$/u.test(str)) &&
      !/^\d+$/u.test(str) &&
      !/[a-zA-Z]+$/u.test(str)
    );
  }

  /* scoll to bottom */
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat">
      <AnimatePresence mode="wait">
        <motion.div
          key={profileOpened} // ключ — обязательно! Меняется при смене чата
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="h-full relative" // добавь нужные размеры и классы, чтобы сохранить layout
        >
          {profileOpened ? (
            <>
              <ProfilePage
                users={users}
                id={id}
                setProfileOpened={setProfileOpened}
                addToContacts={addToContacts}
                contacts={contacts}
              ></ProfilePage>
            </>
          ) : (
            <>
              {!profileOpened && (
                <div
                  className={
                    `chat_header` + " " + (profileOpened && "profile_header")
                  }
                >
                  <button
                    className="btn-icon btn-secondary"
                    onClick={() => setOpenedMenu(!openedMenu)}
                  >
                    <img src={menu_icon} />
                  </button>
                  <div
                    className="chat_header--info"
                    onClick={() => setProfileOpened(true)}
                  >
                    <Avatar
                      size={36}
                      name={users.find((user) => user.id == id)?.username}
                      img_url={users.find((user) => user.id == id)?.avatar_path}
                      online={users.find((user) => user.id == id)?.online}
                    ></Avatar>
                    <div className="chat_header--text">
                      {users.find((user) => user.id == id)?.username}

                      <div className="txt-secondary">
                        {users.find((user) => user.id == id)?.online ? (
                          <div className="online">online</div>
                        ) : (
                          <div className="txt-secondary">
                            last seen{" "}
                            {moment(
                              users.find((user) => user.id == id)?.updated_at
                            )
                              .format("DD MMMM, HH:mm")
                              .toLocaleLowerCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link to="/messenger">
                    {/* <button className="btn-secondary">Close</button> */}
                    {!isMobile && (
                      <button className="btn-icon btn-secondary">
                        <img src={close_icon} />
                      </button>
                    )}
                  </Link>
                </div>
              )}

              <div className="chat_messages flex-end">
                {!id && <p>Select any chat from the list</p>}
                {messages.length ? (
                  messages.map((message, index) => (
                    <>
                      {moment(message.created_at).format("YYYY-MM-DD") !==
                        moment(messages[index - 1]?.created_at).format(
                          "YYYY-MM-DD"
                        ) && (
                        <div className="messages_separator">
                          <div className="date">
                            {moment(message.created_at).format("DD MMMM")}
                          </div>
                        </div>
                      )}
                      <div
                        className={`message ${
                          message.id1 == id && "message-own"
                        }`}
                      >
                        <div
                          className={`message-bubble ${
                            isEmoji(message.message) && "emoji-bubble"
                          } `}
                          key={message.id}
                        >
                          <div className="message_images">
                            {/* <GridLayout autoLayout cols={3} rows={2}> */}
                            <PhotoProvider>
                              {message.images &&
                                message.images.map((image, i) => (
                                  <PhotoView
                                    key={i}
                                    src={`http://localhost:3001/${image}`}
                                  >
                                    <img
                                      src={`http://localhost:3001/${image}`}
                                      alt=""
                                    />
                                  </PhotoView>
                                ))}
                            </PhotoProvider>
                          </div>

                          {message.message}
                          <div className=" message-bubble--time">
                            {moment(message.created_at).format("HH:mm")}
                          </div>
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
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <div className="flex_center" style={{ height: "100%" }}>
                    <span className="txt-secondary">No messages here</span>
                  </div>
                )}
                <div ref={messagesEndRef}></div>
              </div>
              {/* {Array.from(typingUsers).map((userId) => (
                <p key={userId} style={{ margin: 0 }}>
                  Пользователь {userId} печатает...
                </p>
              ))} */}

              <AnimatePresence>
                {Array.from(typingUsers).length > 0 && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.1 }}
                    style={{
                      opacity: "0.4",
                      padding: "0 12px ",
                    }}
                  >
                    {Array.from(typingUsers).map((userId) => (
                      <p key={userId} style={{ margin: 0 }}>
                        печатает...
                        {/* Пользователь {userId} печатает... */}
                      </p>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <ChatInput
                id={id}
                onSubmit={(data) => {
                  console.log("onSubmit data", data);
                  setMessages([...messages, data]);
                }}
                isLoggedIn={isLoggedIn}
                fetchChats={fetchChats}
                messages={messages}
                setMessages={setMessages}
              />

              <input
                type="text"
                onChange={onUserTyping}
                placeholder="Напиши сообщение..."
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Chat;
