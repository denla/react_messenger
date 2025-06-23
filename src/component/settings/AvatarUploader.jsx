import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext";
import Avatar from "../Avatar";

const AvatarUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      axios.get(`http://localhost:3001/avatar/${isLoggedIn.id}`).then((res) => {
        setAvatar(
          `http://localhost:3001/${res.data[res.data?.length - 1]?.avatar_path}`
        );
      });
    }
  }, []);

  // const handleFileChange = (event) => {
  //   setSelectedFile(event.target.files[0]);
  // };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
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
    <div className="flex-row">
      <div
        className="a"
        style={{ backgroundImage: `url(${avatar})`, width: "100px" }}
      ></div>
      {/* <img src={avatar}></img> */}

      <div className="flex-column">
        <label htmlFor="file-upload" className="file-label">
          Выбрать файл
        </label>
        <input id="file-upload" type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Загрузить аватар</button>
        {uploaded && <p>Аватар загружен успешно!</p>}
      </div>
    </div>
  );
};

export default AvatarUploader;
