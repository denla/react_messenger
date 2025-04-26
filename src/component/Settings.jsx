import { useNavigate } from "react-router-dom";
const Settings = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="settings_profile">
        <div className="a-120"></div>
        <h2>{isLoggedIn?.username}</h2>
        {isLoggedIn?.email}
        <br />
        {isLoggedIn?.id}
        <button
          onClick={() => {
            setIsLoggedIn();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Settings;
