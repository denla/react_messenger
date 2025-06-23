import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import AvatarUploader from "./AvatarUploader";

// import ImageUploader from "./ImageUploader";

const ProfileSettings = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const onSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      username: username,
      bio: bio,
    };
    console.log(data);
    axios
      .patch(`http://localhost:3001/users/${isLoggedIn.id}`, {
        email,
        username,
        bio,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setEmail(isLoggedIn?.email);
    setUsername(isLoggedIn?.username);
  }, []);

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      {/* <div className="card_title">Avatar</div> */}
      <div className="card">
        <AvatarUploader isLoggedIn={isLoggedIn} />
        {/* <ImageUploader /> */}
      </div>

      <div className="card_title">Username</div>
      <div className="card card_input">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="txt-secondary input_description">
        Enter your name and add a profile photo
      </div>

      <div className="card_title">Email</div>
      <div className="card card_input">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="card_title">Bio</div>
      <div className="card card_input">
        <input
          type="text"
          placeholder="Enter your bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <div className="txt-secondary input_description">
        Enter such as your job title, hobbies, etc. <br></br>This will be
        visible to other users.
      </div>
      <button type="submit">Save</button>
    </form>
  );
};
export default ProfileSettings;
