import { React, useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import moment from "moment";

const Chats = ({ chats, setChats }) => {
  const { id } = useParams();

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
                  <div className="txt-secondary">
                    {moment(chat.timestamp).format("HH:mm")}
                  </div>
                </div>
                <div className="txt-secondary">{chat.last_message}</div>
                {/* <div className="txt-secondary">{chat.updated_at}</div> */}
              </div>
            </div>
          </Link>
        ))}
    </>
  );
};

export default Chats;
