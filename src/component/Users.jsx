import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Tab from "./Tab";
import Avatar from "./Avatar";

import SearchInput from "./main_menu/SearchInput";
import Tabs from "./Tabs";
import User from "./main_menu/User";

import EmptyState from "./EmptyState";

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

  const filteredContacts = contacts.filter((user) =>
    user.username.toLowerCase().includes(searchText)
  );

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchText)
  );

  const tabs = [
    {
      title: "Contacts",
      content: (
        <>
          {filteredContacts.length > 0 ? (
            filteredContacts.map((user) => (
              <User
                key={user.id}
                id={id}
                user={user}
                isMobile={isMobile}
                setOpenedMenu={setOpenedMenu}
              />
            ))
          ) : (
            <EmptyState title="No contacts found" emoji={"🔍"} />
          )}
        </>
      ),
    },
    {
      title: "All",
      content: (
        <>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <User
                key={user.id}
                id={id}
                user={user}
                isMobile={isMobile}
                setOpenedMenu={setOpenedMenu}
              />
            ))
          ) : (
            <EmptyState title="No users found" emoji={"🔍"} />
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="chats_left--header">
        <h2>Contacts</h2>
        <SearchInput searchText={searchText} setSearchText={setSearchText} />
      </div>

      <Tabs tabs={tabs} />
    </>
  );
};

export default Users;
