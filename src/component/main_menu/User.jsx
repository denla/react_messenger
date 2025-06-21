import react from "react";
import { Link } from "react-router-dom";
import Avatar from "../Avatar";
import moment from "moment";

const User = ({ id, user, isMobile, setOpenedMenu }) => {
  return (
    <Link
      to={`/messenger/${user.id}`}
      onClick={() => {
        if (isMobile) {
          setOpenedMenu(false);
        }
      }}
    >
      <div
        className={`chat_item ${user.id == id && !isMobile && "active_chat"}`}
        key={user.id}
      >
        <Avatar
          size={50}
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
  );
};

export default User;
