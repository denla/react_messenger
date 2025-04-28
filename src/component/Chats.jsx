import { React, useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import moment from "moment";
import ContextButton from "./ContextButton";
import { useNavigate } from "react-router-dom";

const Chats = ({ chats, setChats }) => {
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
      <input
        className="search"
        type="text"
        placeholder="Search"
        onChange={(e) => setSearchText(e.target.value)}
      />

      {chats
        .filter((chat) =>
          chat.other_username.toLowerCase().includes(searchText)
        )
        .map((chat) => (
          <Link to={`/messenger/${chat.other_uid}`}>
            <div
              className={`chat_item ${chat.other_uid == id && "active_chat"}`}
              key={chat.other_uid}
            >
              <div
                className="a-50"
                style={{
                  backgroundImage: `url(http://localhost:3001/${chat.avatar_path})`,
                }}
              ></div>
              <div className="message_right">
                <div className="message_top">
                  {chat.other_username}

                  <button
                    className="context_button"
                    onClick={() => removeChat(chat.chat_id)}
                  >
                    ···
                  </button>

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
                <div className="txt-secondary">
                  {chat.last_message ? (
                    chat.last_message
                  ) : (
                    <span className="message-deleted">Deleted message</span>
                  )}
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
