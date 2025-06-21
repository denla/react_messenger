import { React, useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import moment from "moment";
import ContextButton from "./ContextButton";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";

import Tabs from "./Tabs";
import SearchInput from "./main_menu/SearchInput";
const Chats = ({ chats, setChats, openedMenu, setOpenedMenu, isMobile }) => {
  const { id } = useParams();

  const navigate = useNavigate();
  // const [chats, setChats] = useState([]);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [searchText, setSearchText] = useState("");

  // useEffect(() => {
  //   axios.get(`http://localhost:3001/chats/${isLoggedIn.id}`).then((res) => {
  //     console.log("CHATS");
  //     console.log(res.data);
  //     setChats(res.data);
  //   });
  // }, [id]);

  // useEffect(()=> {
  //   ch
  // }, [searchText])

  const removeChat = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/chats/${id}`);
      setChats(chats.filter((chat) => chat.chat_id !== id));
      console.log(response.data);
      navigate("/messenger");
    } catch (error) {
      console.error(error);
      //   setError(error.message);
    }
  };

  return (
    <>
      <div className="chats_left--header">
        <h2>Chats</h2>
        <SearchInput searchText={searchText} setSearchText={setSearchText} />
      </div>

      {/* <Tabs /> */}
      {chats
        .filter((chat) =>
          chat.other_username.toLowerCase().includes(searchText)
        )
        .map((chat) => (
          <Link to={`/messenger/${chat.other_uid}`}>
            <div
              className={`chat_item ${
                chat.other_uid == id && !isMobile && "active_chat"
              }`}
              key={chat.other_uid}
              onClick={() => {
                if (isMobile) {
                  setOpenedMenu(false);
                }
              }}
            >
              <Avatar
                size={54}
                name={chat.other_username}
                img_url={chat.avatar_path}
                online={chat.other_online}
              ></Avatar>

              <div className="message_right">
                <div className="message_top">
                  {chat.other_username}

                  {/* <ContextButton
                    list={[
                      {
                        title: "Delete",
                        onClick: () => removeChat(chat.id),
                      },
                    ]}
                  /> */}

                  <div className="txt-secondary">
                    {chat.timestamp && moment(chat.timestamp).format("HH:mm")}
                  </div>
                </div>

                <div className="message_bottom">
                  <div className=" message_preview">
                    {chat.last_message ? (
                      chat.last_message
                    ) : (
                      <span className="message-deleted">Deleted message</span>
                    )}
                  </div>
                  <button
                    className="context_button"
                    onClick={() => removeChat(chat.chat_id)}
                  >
                    ···
                  </button>
                </div>
                {/* <div className="txt-secondary">{chat.updated_at}</div> */}
              </div>
            </div>
          </Link>
        ))}
    </>
  );
};

export default Chats;
