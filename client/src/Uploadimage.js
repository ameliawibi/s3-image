import React, { useState, useContext } from "react";
import { DispatchContext, ImageListContext } from "./App";
import axios from "axios";

function UploadImage() {
  const [theMessage, setMessages] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useContext(DispatchContext);
  const { actions } = useContext(ImageListContext);

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

    axios
      .post("/uploadfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        //console.log(res);
        if (res) {
          setMessages("File uploaded successfully");
          dispatch({
            type: actions.UPLOAD,
            payload: res.data.files,
          });
        }
      })
      .catch((error) => {
        console.error(error.response);
        setMessages("Please select a file");
      });
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

export default UploadImage;
