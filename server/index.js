const express = require("express");
const { s3 } = require("./s3");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3001;
const bucketName = process.env.AWS_BUCKET_NAME;

app.get("/getfiles", (_req, res) => {
  s3.listObjects(
    {
      Bucket: bucketName,
    },
    function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        let updatedData = data.Contents;
        updatedData.forEach((item, index) => {
          let urlToAdd = s3.getSignedUrl("getObject", {
            Bucket: bucketName,
            Key: item.Key,
            Expires: 60 * 5,
          });
          updatedData[index].SignedUrl = urlToAdd;
        });
        //console.log(updatedData);
        return res.json({ files: updatedData });
      }
    }
  );
});

app.post("/uploadfile", upload.single("file"), (req, res) => {
  // console.log(req);
  //console.log(req.file);
  if (req.file == null) {
    return res.status(400).json({ message: "Please choose the file" });
  }
  var file = req.file;
  // res.send(200);
  // res.sendStatus(201);

  const uploadImage = (file) => {
    const fileStream = fs.createReadStream(file.path);
    //console.log(fileStream);
    const params = {
      Bucket: bucketName,
      Key: file.originalname,
      Body: fileStream,
    };

    s3.upload(params, function (err, data) {
      //console.log(data);
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
      let updatedData = data;
      let urlToAdd = s3.getSignedUrl("getObject", {
        Bucket: bucketName,
        Key: updatedData.Key,
        Expires: 60 * 5,
      });
      updatedData.SignedUrl = urlToAdd;
      console.log(updatedData);
      return res.status(201).json({ files: updatedData });
    });
  };
  uploadImage(file);
});

app.get("/getfile/:filename", (req, res) => {
  let fileName = req.params.filename;
  //console.log(fileName);
  const url = s3.getSignedUrl("getObject", {
    Bucket: bucketName,
    Key: fileName,
    Expires: 60 * 5,
  });
  //console.log(url);
  res.json({ url: url });
});

app.get("/deletefile/:filename", (req, res) => {
  let fileName = req.params.filename;

  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  s3.deleteObject(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else console.log(data);
    return res.sendStatus(201);
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
