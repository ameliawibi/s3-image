const express = require("express");
const AWS = require("aws-sdk");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3001;

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region,
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
    });
  };
  uploadImage(file);
  return res.sendStatus(201);
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
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
