import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Tab from "./Tab";
import Avatar from "./Avatar";

const Users = ({ id, isLoggedIn, setOpenedMenu, isMobile }) => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

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

  useEffect(() => {
    axios
      .get(`http://localhost:3001/contacts/${isLoggedIn.id}`)
      .then((response) => {
        setContacts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:3001/contacts/${isLoggedIn.id}`)
  //     .then((response) => {
  //       console.log(response.data);
  //       setUsers(response.data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);
  const tabs = [
    { title: "Contacts", content: "" },
    { title: "All", content: "" },
  ];

  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search"
        onChange={(e) => setSearchText(e.target.value)}
      />

      {/* <div className="card_title">People</div> */}
      <div className="menu_tabs" style={{ padding: "10px 0" }}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`menu_tab ${activeTab === index && "active_tab"}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      {activeTab == 0 &&
        contacts &&
        contacts
          .filter((user) => user.username.toLowerCase().includes(searchText))
          .map((user) => (
            <Link
              to={`/messenger/${user.id}`}
              onClick={() => {
                if (isMobile) {
                  setOpenedMenu(false);
                }
              }}
            >
              <div
                className={`chat_item ${
                  user.id == id && !isMobile && "active_chat"
                }`}
                key={user.id}
              >
                {/* <div
                  className={`a-50 ${user.online && "a-online"}`}
                  style={{
                    backgroundImage: `url(http://localhost:3001/${user.avatar_path})`,
                  }}
                ></div> */}

                <Avatar
                  size={64}
                  name={user.username}
                  img_url={user.avatar_path}
                  online={user.online}
                ></Avatar>

                <div className="message_right">
                  {console.log("user.id", user.id, "id", id)}
                  {user.username}{" "}
                  {user.online ? (
                    <div className="online">online</div>
                  ) : (
                    <div className="txt-secondary">
                      last seen{" "}
                      {moment(user.updated_at)
                        .format("DD MMMM, HH:mm")
                        .toLocaleLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}

      {/* <div className="card_title">Users</div> */}

      {activeTab == 1 &&
        users &&
        users
          .filter((user) => user.username.toLowerCase().includes(searchText))
          .map((user) => (
            <Link
              to={`/messenger/${user.id}`}
              onClick={() => {
                if (isMobile) {
                  setOpenedMenu(false);
                }
              }}
            >
              <div
                className={`chat_item ${
                  user.id == id && !isMobile && "active_chat"
                }`}
                key={user.id}
              >
                {/* <div
                  className={`a-50 ${user.online && "a-online"}`}
                  style={{
                    backgroundImage: `url(http://localhost:3001/${user.avatar_path})`,
                  }}
                ></div> */}

                <Avatar
                  size={64}
                  name={user.username}
                  img_url={user.avatar_path}
                  online={user.online}
                ></Avatar>
                <div className="message_right">
                  {console.log("user.id", user.id, "id", id)}
                  {user.username}{" "}
                  {user.online ? (
                    <div className="online">online</div>
                  ) : (
                    <div className="txt-secondary">
                      last seen{" "}
                      {moment(user.updated_at)
                        .format("DD MMMM, HH:mm")
                        .toLocaleLowerCase()}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
    </>
  );
};

export default Users;
