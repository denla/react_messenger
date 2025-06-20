import React, { useState, useEffect, useContext } from "react";
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

/*icons*/

import back_icon from "../sources/icons/back_icon.svg";
import close_icon from "../sources/icons/close_icon.svg";
import emoji_icon from "../sources/icons/emoji_icon.svg";
import send_icon from "../sources/icons/send_icon.svg";
import menu_icon from "../sources/icons/menu_icon.svg";

/*framer-motion*/
import { AnimatePresence, motion } from "framer-motion";

const Chat = ({
  users,
  id,
  messages,
  setMessages,
  fetchChats,
  openedMenu,
  setOpenedMenu,
  isMobile,
}) => {
  const [text, setText] = useState("");
  const [postText, setPostText] = useState("");

  const [profileOpened, setProfileOpened] = useState(false);
  const [emojiOpened, setEmojiOpened] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [contacts, setContacts] = useState(false);
  const [avatars, setAvatars] = useState([]);
  const [posts, setPosts] = useState([]);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

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
      if (text) {
        const response = await axios.post(
          "http://localhost:3001/message",
          data
        );
        const response2 = await axios.post("http://localhost:3001/chats", {
          uid_2: id,
          uid_1: isLoggedIn.id,
          last_message_id: response.data.id,
        });
        setMessages([...messages, data]);
      }
      handleUpload();
      fetchChats();
      // handleUploadImage();
      // setImages([]);
      // setImageFiles([]);
      // setText("");
    } catch (error) {
      console.error(error);
      //   setError(error.message);
    }
  };

  const onSendPost = async (data) => {
    try {
      const response = await axios.post("http://localhost:3001/posts", data);
      setPosts([data, ...posts]);
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

  /*Images remove */

  const handleDeleteImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
  };

  // const handleUpload = () => {
  //   console.log("handleUpload");
  //   if (isLoggedIn) {
  //     const formData = new FormData();
  //     images.forEach((files) => {
  //       formData.append("files", files);
  //     });
  //     formData.append("userId", isLoggedIn.id);
  //     console.log(formData);
  //     axios
  //       .post("http://localhost:3001/upload-images", formData, {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       })
  //       .then((response) => {
  //         console.log("response.data");
  //         console.log("RESPONSE AXIOS UPLOAD IMAGES");
  //       })
  //       .catch((error) => {
  //         console.log("ERRORS AXIOS UPLOAD IMAGES");
  //       });
  //   }
  // };

  const handleUpload = () => {
    console.log("handleUpload");
    if (isLoggedIn && imageFiles.length > 0) {
      const formData = new FormData();

      imageFiles.forEach((file) => {
        formData.append("files", file); // ✅ отправляем настоящие File объекты
      });

      // formData.append("userId", isLoggedIn.id); // пользователь

      formData.append("id1", isLoggedIn.id); // пользователь
      formData.append("id2", id); // получатель

      axios
        .post("http://localhost:3001/upload-images", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log("RESPONSE AXIOS UPLOAD IMAGES", response.data);
          alert("Изображения успешно загружены");
          setImages([]);
          setImageFiles([]);
        })
        .catch((error) => {
          console.error("ERRORS AXIOS UPLOAD IMAGES", error);
          alert("Ошибка загрузки изображений");
        });
    } else {
      alert("Нет выбранных изображений или пользователь не авторизован.");
    }
  };
  // const handleUploadImage = () => {
  //   const formData = new FormData();
  //   images.forEach((image) => {
  //     formData.append("files", image);
  //   });
  //   formData.append("userId", isLoggedIn.id);
  //   console.log("PREV AXIOS UPLOAD IMAGES");
  //   axios
  //     .post("http://localhost:3001/upload-images", formData)
  //     .then((response) => {
  //       console.log("RESPONSE AXIOS UPLOAD IMAGES");
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.log("ERRORS AXIOS UPLOAD IMAGES");
  //       console.error(error);
  //     });
  // };

  /*-=======*/

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
  const handleEmojiClick = (emojiData) => {
    setText((prevText) => prevText + emojiData.emoji);
  };

  function isEmoji(str) {
    return (
      (str === "❤️" || /^\p{Emoji}+$/u.test(str)) &&
      !/^\d+$/u.test(str) &&
      !/[a-zA-Z]+$/u.test(str)
    );
  }
  // function isEmoji(str) {
  //   return /\p{Emoji_Presentation}/u.test(str);
  // }

  // function isEmoji(str) {
  //   return (
  //     [...str].every((char) => /\p{Emoji_Presentation}/u.test(char)) &&
  //     !/[a-zA-Z0-9]/u.test(str)
  //   );
  // }

  return (
    <div className="chat">
      <div
        className={`chat_header` + " " + (profileOpened && "profile_header")}
      >
        {!profileOpened ? (
          <>
            <button
              className="btn-icon"
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
                      {moment(users.find((user) => user.id == id)?.updated_at)
                        .format("DD MMMM, HH:mm")
                        .toLocaleLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="chat_header--info">
            <button
              className="btn-secondary"
              onClick={() => setProfileOpened(false)}
            >
              Back
            </button>
          </div>
        )}
        <Link to="/messenger">
          {/* <button className="btn-secondary">Close</button> */}
          {!isMobile && (
            <button className="btn-icon" type="submit">
              <img src={close_icon} />
            </button>
          )}
        </Link>
      </div>

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
              <div className="chat_messages flex_w-center">
                <div className="cards_container">
                  <div className="flex_w-center flex-column chat_profile card">
                    <Avatar
                      size={120}
                      name={users.find((user) => user.id == id)?.username}
                      img_url={users.find((user) => user.id == id)?.avatar_path}
                      online={users.find((user) => user.id == id)?.online}
                    ></Avatar>

                    <h2 className="profile_name">
                      {users.find((user) => user.id == id)?.username}
                    </h2>
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

                    {/* {users.find((user) => user.id == id)?.email} */}
                    <div className="profile_buttons">
                      <button onClick={() => setProfileOpened(false)}>
                        Send message
                      </button>

                      <button
                        onClick={() => addToContacts(id)}
                        className={contacts && "btn-secondary"}
                      >
                        {contacts ? "Remove contact" : "Add contact"}
                      </button>
                    </div>
                  </div>

                  {avatars.length ? (
                    <>
                      <div className="card_title">Avatars</div>
                      <div className="card">
                        <div className="profile_photos">
                          <PhotoProvider>
                            {avatars.map((photo, i) => (
                              <PhotoView
                                key={i}
                                src={`http://localhost:3001/${photo.avatar_path}`}
                              >
                                {/* <img
                              src={`http://localhost:3001/${photo.avatar_path}`}
                              alt=""
                            /> */}
                                <div
                                  key2={photo.id}
                                  user_id={photo.user_id}
                                  className="profile_photos--item"
                                  style={{
                                    backgroundImage: `url(http://localhost:3001/${photo.avatar_path})`,
                                  }}
                                ></div>
                              </PhotoView>
                            ))}
                          </PhotoProvider>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <div className="card_title">Posts</div>
                  {isLoggedIn.id == id && (
                    <>
                      <div className="card" style={{ padding: "8px" }}>
                        <form
                          className="chat_form"
                          onSubmit={(e) => {
                            e.preventDefault();
                            onSendPost({
                              user_id: isLoggedIn.id,
                              text: postText,
                            });
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
                    </>
                  )}

                  {/* <div className="card">No posts here</div> */}
                  <div className="card posts">
                    {posts.length == 0 && (
                      <span className="txt-secondary no_posts">
                        {" "}
                        No posts here
                      </span>
                    )}
                    {posts.map((post) => (
                      <>
                        <div className="post" key={post.id}>
                          <div
                            className="chat_header--info"
                            onClick={() => setProfileOpened(true)}
                          >
                            <Avatar
                              size={36}
                              name={
                                users.find((user) => user.id == id)?.username
                              }
                              img_url={
                                users.find((user) => user.id == id)?.avatar_path
                              }
                              online={
                                users.find((user) => user.id == id)?.online
                              }
                            ></Avatar>
                            <div className="chat_header--text">
                              {users.find((user) => user.id == id)?.username}
                              <div className="txt-secondary">
                                {moment(post.created_at).format(
                                  "DD MMMM, HH:mm"
                                )}
                              </div>
                            </div>
                          </div>

                          {post.text}
                        </div>
                        <div className="separator"></div>
                      </>
                    ))}
                  </div>
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
                          isEmoji(message.message) && "emoji-bubble"
                        } ${message.id1 == id && "own-bubble"}`}
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
                          {/* </GridLayout> */}

                          {/* <img
                            className="image_preview"
                            src={`http://localhost:3001/${image}`}
                            alt=""
                          /> */}
                        </div>

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

              {images.length > 0 ? (
                <>
                  <div className="images_preview">
                    {images.map((image, idx) => {
                      return (
                        <div key={idx} style={{ position: "relative" }}>
                          {" "}
                          <img
                            className="image_preview"
                            src={image}
                            alt=""
                          />{" "}
                          <button
                            className="btn-icon btn-remove-img"
                            onClick={() => handleDeleteImage(idx)}
                          >
                            <img src={close_icon} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {/* <button onClick={handleUpload}>Upload</button> */}
                </>
              ) : null}

              <div className="chat_input">
                <ImageUploader
                  images={images}
                  setImages={setImages}
                  imageFiles={imageFiles}
                  setImageFiles={setImageFiles}
                />
                <form
                  className="chat_form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit({ id1: id, id2: isLoggedIn.id, message: text });
                  }}
                >
                  <div className="chat_input--parent">
                    <div
                      onClick={() => setEmojiOpened(!emojiOpened)}
                      className="btn-icon"
                    >
                      <img src={emoji_icon} />
                    </div>
                    <div
                      className="emoji_picker"
                      style={{ display: emojiOpened ? "block" : "none" }}
                    >
                      <EmojiPicker
                        searchDisabled={true}
                        onEmojiClick={handleEmojiClick}
                      />
                    </div>

                    <input
                      className="w-100 chat_input"
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Write a message..."
                    />
                  </div>
                  <button className="btn-icon primary-btn" type="submit">
                    <img src={send_icon} />
                  </button>
                </form>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Chat;
