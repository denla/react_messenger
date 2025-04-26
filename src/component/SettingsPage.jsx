import AvatarUploader from "./AvatarUploader";
const SettingsPage = () => {
  return (
    <>
      <div className="chat_messages flex_w-center">
        <div className="cards_container">
          <h2>Settings</h2>
          <AvatarUploader />
          <div className="card">
            Name
            <input type="text" />
          </div>

          <div className="card">
            Username
            <input type="text" />
          </div>
          <div className="card">
            Password
            <input type="text" />
          </div>

          <button>Save</button>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
