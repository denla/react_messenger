import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Chats = ({ id, isLoggedIn }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/chats/${isLoggedIn.id}`).then((res) => {
      console.log("CHATS");
      console.log(res.data);
      setChats(res.data);
    });
  }, []);

  return (
    <>
      {chats.map((chat) => (
        <Link to={`/messenger/${chat.other_uid}`}>
          <div
            className={`chat_item ${chat.other_uid == id && "active_chat"}`}
            key={chat.other_uid}
          >
            {chat.other_username}
            <div className="txt-secondary">{chat.last_message}</div>
            {/* <div className="txt-secondary">{chat.updated_at}</div> */}
          </div>
        </Link>
      ))}
    </>
  );
};

export default Chats;
