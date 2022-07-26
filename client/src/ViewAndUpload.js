import React, { useContext, useState } from "react";
import { ImageContext } from "./App";

export function ViewImageList() {
  const { deleteImage, imageList } = useContext(ImageContext);

  return (
    <div>
      <ul>
        {imageList.map((image, index) => (
          <li key={index}>
            <p>{image.Key}</p>
            {image.SignedUrl && <img src={image.SignedUrl} />}
            <button onClick={() => deleteImage(image.Key, index)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function UploadImage() {
  const [theMessage, setMessages] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { uploadImage } = useContext(ImageContext);

  const onChange = (e) => {
    // Update the state
    setSelectedFile(e.target.files[0]);
  };
  const uploadFile = (e) => {
    e.preventDefault();

    // Create an object of formData
    let formData = new FormData();

    // Update the formData object

    formData.append("file", selectedFile);

    uploadImage(formData, setMessages);
  };

  return (
    <div>
      <form method="post" action="#" onSubmit={(e) => uploadFile(e)}>
        <input
          type="file"
          name="uploadfile"
          onChange={(e) => onChange(e)}
        ></input>
        <p> {theMessage}</p>
        <button>Upload</button>
      </form>
    </div>
  );
}
