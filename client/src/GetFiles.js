import React, { useEffect, useState } from "react";
import axios from "axios";

function PreviewImage({ fileName }) {
  const [image, setImage] = useState();

  useEffect(() => {
    /* it will be called when image did update */
  }, [image]);

  const viewImage = (fileName) => {
    axios
      .get(`/getfile/${fileName}`)
      .then((res) => {
        setImage(res.data.url);
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  const handleDelete = (fileName) => {
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
    <>
      <img src={image}></img>
      <br />
      <button onClick={() => viewImage(fileName)}>View</button>
      <button onClick={() => handleDelete(fileName)}>Delete</button>
    </>
  );
}

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
  }, [files]);

  return (
    <div>
      <h4>All images</h4>
      {files.map((file, index) => (
        <div key={index}>
          <p>{file.Key}</p>
          <PreviewImage fileName={file.Key} />
        </div>
      ))}
    </div>
  );
}
