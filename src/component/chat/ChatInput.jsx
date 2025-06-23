import react from "react";
import ImageUploader from "../ImageUploader";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import emoji_icon from "../../sources/icons/emoji_icon.svg";
import send_icon from "../../sources/icons/send_icon.svg";
import axios from "axios";

const ChatInput = ({ id, isLoggedIn, fetchChats, messages, setMessages }) => {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [emojiOpened, setEmojiOpened] = useState(false);

  const onEmojiClick = (event, emoji) => {
    setText(text + emoji);
  };

  const handleEmojiClick = (emojiData) => {
    setText((prevText) => prevText + emojiData.emoji);
  };

  /*Images remove */

  const handleDeleteImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
  };

  const handleUpload = () => {
    console.log("handleUpload");
    if (isLoggedIn && imageFiles.length > 0) {
      const formData = new FormData();

      imageFiles.forEach((file) => {
        formData.append("files", file); // ✅ отправляем настоящие File объекты
      });

      // formData.append("userId", isLoggedIn.id); // пользователь

      formData.append("id1", isLoggedIn.id); // пользователь
      formData.append("id2", id); // получатель

      axios
        .post("http://localhost:3001/upload-images", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          console.log("RESPONSE AXIOS UPLOAD IMAGES", response.data);
          alert("Изображения успешно загружены");
          setImages([]);
          setImageFiles([]);
        })
        .catch((error) => {
          console.error("ERRORS AXIOS UPLOAD IMAGES", error);
          alert("Ошибка загрузки изображений");
        });
    } else {
      alert("Нет выбранных изображений или пользователь не авторизован.");
    }
  };

  const onSubmit = async (data) => {
    try {
      if (text) {
        const response = await axios.post(
          "http://localhost:3001/message",
          data
        );
        const response2 = await axios.post("http://localhost:3001/chats", {
          uid_2: id,
          uid_1: isLoggedIn.id,
          last_message_id: response.data.id,
        });
        setMessages([...messages, data]);
      }
      handleUpload();
      fetchChats();
      // handleUploadImage();
      // setImages([]);
      // setImageFiles([]);
      // setText("");
    } catch (error) {
      console.error(error);
      //   setError(error.message);
    }
  };

  return (
    <div className="chat_input">
      <ImageUploader
        images={images}
        setImages={setImages}
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
      />
      <form
        className="chat_form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ id1: id, id2: isLoggedIn.id, message: text });
        }}
      >
        <div className="chat_input--parent">
          <div
            onClick={() => setEmojiOpened(!emojiOpened)}
            className="btn-icon"
          >
            <img src={emoji_icon} />
          </div>
          <div
            className="emoji_picker"
            style={{ display: emojiOpened ? "block" : "none" }}
          >
            <EmojiPicker
              searchDisabled={true}
              onEmojiClick={handleEmojiClick}
            />
          </div>

          <input
            className="w-100 chat_input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
          />
        </div>
        <button className="btn-icon primary-btn" type="submit">
          <img src={send_icon} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
