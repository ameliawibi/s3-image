import React, { useState } from "react";
import axios from "axios";

let fileName = "photo_2022-07-16_15-19-32.jpg";

export default function GetFile() {
  const [file, setFile] = useState("");

  const handleClick = () => {
    axios
      .get(`/getfile/${fileName}`)
      .then((res) => {
        console.log(res);
        setFile(res.data.url);
        console.log(file);
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  const deleteFile = () => {
    axios
      .get(`/deletefile/${fileName}`)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  return (
    <div>
      <button onClick={handleClick}>Get Image</button>
      <button onClick={deleteFile}>Delete image</button>
      <br />
      {file && <img src={file} width="50%" height="50%"></img>}
    </div>
  );
}
