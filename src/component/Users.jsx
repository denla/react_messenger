import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Users = ({ id, isLoggedIn }) => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/users")
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search"
        onChange={(e) => setSearchText(e.target.value)}
      />
      {users &&
        users
          .filter((user) => user.username.toLowerCase().includes(searchText))
          .map((user) => (
            <Link to={`/messenger/${user.id}`}>
              <div
                className={`chat_item ${user.id == id && "active_chat"}`}
                key={user.id}
              >
                <div
                  className={`a-50 ${user.online && "a-online"}`}
                  style={{
                    backgroundImage: `url(http://localhost:3001/${user.avatar_path})`,
                  }}
                ></div>
                <div className="message_right">
                  {console.log("user.id", user.id, "id", id)}
                  {user.username}{" "}
                  {user.online ? (
                    <div className="online">online</div>
                  ) : (
                    <div className="txt-secondary">last seen recently</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
    </>
  );
};

export default Users;
