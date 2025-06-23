import React from "react";
import Avatar from "../Avatar";
import { PhotoProvider, PhotoView } from "react-photo-view";
import moment from "moment";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import axios from "axios";

import back_icon from "../../sources/icons/back_icon.svg";
import close_icon from "../../sources/icons/close_icon.svg";
import contacts_icon from "../../sources/icons/contacts.svg";
import chats_icon from "../../sources/icons/chats.svg";
import send_icon from "../../sources/icons/send_icon.svg";

import { Link } from "react-router-dom";
import EmptyState from "../EmptyState";
const ProfilePage = ({
  users,
  id,
  setProfileOpened,
  addToContacts,
  contacts,
}) => {
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [avatars, setAvatars] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

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

  useEffect(() => {
    axios.get(`http://localhost:3001/avatars/${id}`).then((res) => {
      setAvatars(res.data);
    });
  }, [id]);

  return (
    <>
      <div className={`chat_header profile_header`}>
        <div className="chat_header--info">
          <button
            className="btn-icon btn-secondary"
            type="submit"
            onClick={() => setProfileOpened(false)}
          >
            <img src={back_icon} />
          </button>
        </div>
        <Link to="/messenger">
          {/* <button className="btn-secondary">Close</button> */}
          {!isMobile && (
            <button className="btn-icon btn-secondary" type="submit">
              <img src={close_icon} />
            </button>
          )}
        </Link>
      </div>

      <div className="chat_messages flex_w-center bg-gray">
        <div className="cards_container ">
          <div className="flex_w-center flex-column chat_profile card ">
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
                  {moment(users.find((user) => user.id == id)?.updated_at)
                    .format("DD MMMM, HH:mm")
                    .toLocaleLowerCase()}
                </div>
              )}
            </div>

            {/* {users.find((user) => user.id == id)?.email} */}
            <div className="profile_buttons">
              <button
                onClick={() => setProfileOpened(false)}
                className="btn-secondary"
              >
                <img src={chats_icon} />
                Send message
              </button>

              <button
                onClick={() => addToContacts(id)}
                className={"btn-secondary"}
              >
                <img src={contacts_icon} />
                {contacts ? "Remove contact" : "Add contact"}
              </button>
            </div>
          </div>

          {users.find((user) => user.id == id)?.bio ? (
            <>
              <div className="card_title">BIO</div>
              <div className="card">
                {users.find((user) => user.id == id)?.bio}
              </div>
            </>
          ) : (
            ""
          )}

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
                    placeholder="Start typing a post here.."
                  />
                  <button className="btn-icon primary-btn" type="submit">
                    <img src={send_icon} />
                  </button>
                </form>
              </div>
            </>
          )}

          {/* <div className="card">No posts here</div> */}
          <div className="posts">
            {posts.length == 0 && (
              <>
                <EmptyState title="No posts here" emoji="💬" />
                {/* <img src={monkey_emoji} style={{ width: "100px" }} /> */}
              </>
            )}
            {posts.map((post) => (
              <>
                <div className="card" key={post.id}>
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
                        {moment(post.created_at).format("DD MMMM, HH:mm")}
                      </div>
                    </div>
                  </div>

                  {post.text}
                </div>
                {/* <div className="separator"></div> */}
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
