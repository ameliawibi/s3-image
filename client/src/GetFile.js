import React, { useState } from "react";
import axios from "axios";

export default function GetFile() {
  const [file, setFile] = useState("");

  const handleClick = () => {
    let fileName = "photo_2022-07-16_15-19-32.jpg";
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

  return (
    <div>
      <button onClick={handleClick}>Get Image</button>
      <br />
      <img src={file} width="50%" height="50%"></img>
    </div>
  );
}
