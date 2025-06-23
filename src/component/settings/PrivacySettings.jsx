import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";

const PrivacySettings = () => {
  const [password, setPassword] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log({
      //   email: email,
      //   username: username,
      password: password,
    });
    // axios
    //   .patch(`http://localhost:3001/users/${isLoggedIn.id}`, {
    //     email: email,
    //     username: username,
    //     password: password,
    //   })
    //   .then((response) => {
    //     console.log(response.data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };

  useEffect(() => {
    setPassword(isLoggedIn?.password);
  }, []);

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <div className="card_title">Password</div>
      <div className="card card_input gap-5">
        <input
          //   type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <hr></hr>
        <input type="password" value={password} />
      </div>

      <button type="submit">Save</button>
    </form>
  );
};
export default PrivacySettings;
