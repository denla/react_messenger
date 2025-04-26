import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

const AvatarUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (isLoggedIn) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);
      formData.append("userId", isLoggedIn.id);
      axios
        .post("http://localhost:3001/upload-avatar", formData)
        .then((response) => {
          setUploaded(true);
          setIsLoggedIn({
            ...isLoggedIn,
            avatar_path: response.data.avatar_path,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Загрузить аватар</button>
      {uploaded && <p>Аватар загружен успешно!</p>}
    </div>
  );
};

export default AvatarUploader;
