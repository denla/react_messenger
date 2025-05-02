import { useEffect, useState } from "react";
import attach_icon from "../sources/icons/attach_icon.svg";

const imageTypeRegex = /image\/(png|jpg|jpeg)/gm;

function ImageUploader({ imageFiles, setImageFiles, images, setImages }) {
  //   const [imageFiles, setImageFiles] = useState([]);
  //   const [images, setImages] = useState([]);

  const changeHandler = (e) => {
    const { files } = e.target;
    const validImageFiles = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.match(imageTypeRegex)) {
        validImageFiles.push(file);
      }
    }
    if (validImageFiles?.length) {
      setImageFiles(validImageFiles);
      return;
    }
    alert("Selected images are not of valid type!");
  };

  useEffect(() => {
    const imagesArr = [],
      fileReaders = [];
    let isCancel = false;
    if (imageFiles?.length) {
      imageFiles.forEach((file) => {
        const fileReader = new FileReader();
        fileReaders.push(fileReader);
        fileReader.onload = (e) => {
          const { result } = e.target;
          if (result) {
            imagesArr.push(result);
          }
          if (imagesArr.length === imageFiles.length && !isCancel) {
            setImages(imagesArr);
          }
        };
        fileReader.readAsDataURL(file);
      });
    }
    return () => {
      isCancel = true;
      fileReaders.forEach((fileReader) => {
        if (fileReader.readyState === 1) {
          fileReader.abort();
        }
      });
    };
  }, [imageFiles]);

  return (
    <form>
      <label htmlFor="file" className="loader_image">
        {/* <div className="btn-secondary">...</div> */}
        <div className="btn-icon" type="submit">
          <img src={attach_icon} />
        </div>
      </label>
      <input
        type="file"
        id="file"
        onChange={changeHandler}
        accept="image/png, image/jpg, image/jpeg"
        className="loader_input"
        multiple
      />
    </form>
  );
}

export default ImageUploader;
