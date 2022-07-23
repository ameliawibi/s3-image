import React, { useEffect, useState } from "react";
import axios from "axios";

export default function GetFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios
      .get("/getfiles")
      .then((res) => {
        setFiles(res.data.files);
      })
      .catch((error) => {
        console.error(error.response);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {files.map((file, index) => (
        <p key={index}>{file.Key}</p>
      ))}
    </div>
  );
}
