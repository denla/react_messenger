import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Users = ({ id, isLoggedIn }) => {
  const [users, setUsers] = useState([]);

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
      {users &&
        users.map((user) => (
          <Link to={`/messenger/${user.id}`}>
            <div
              className={`chat_item ${user.id == id && "active_chat"}`}
              key={user.id}
            >
              {console.log("user.id", user.id, "id", id)}
              {user.username} <div className="txt-secondary">{user.email}</div>
            </div>
          </Link>
        ))}
    </>
  );
};

export default Users;
