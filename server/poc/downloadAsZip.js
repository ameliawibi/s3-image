const XmlStream = require("xml-stream");
const stream = require("stream");
const archiver = require("archiver");

const { s3 } = require("../s3");

const folder = "1/nft/";
const bucketName = process.env.AWS_BUCKET_NAME;

const zipParams = {
  Bucket: bucketName,
  Prefix: folder,
};

const filesArray = [];
async function listObjectsArray() {
  const files = s3.listObjects(zipParams).createReadStream();
  const xml = new XmlStream(files);
  xml.collect("Key");
  xml.on("endElement: Key", function (item) {
    filesArray.push(item["$text"].substr(folder.length));
  });

  xml.on("end", function () {
    zipFunction();
  });
}
listObjectsArray();

async function zipFunction() {
  console.log(filesArray);
  const s3FileDwnldStreams = filesArray.map((item) => {
    console.log(`${folder}${item}`);
    const pass = s3
      .getObject({ Bucket: bucketName, Key: `${folder}${item}` })
      .createReadStream();
    return {
      stream: pass,
      fileName: `${item}`,
    };
  });

  const streamPassThrough = new stream.PassThrough();

  const uploadParams = {
    Body: streamPassThrough,
    ContentType: "application/zip",
    Key: "zippedFileKey",
    Bucket: bucketName,
  };

  const s3Upload = s3.upload(uploadParams, (err, data) => {
    if (err) console.error("upload error", err);
    else console.log("upload done", data);
  });
  const archive = archiver("zip", {
    zlib: { level: 0 },
  });
  archive.on("error", (error) => {
    throw new Error(
      `${error.name} ${error.code} ${error.message} ${error.path}  ${error.stack}`
    );
  });

  await new Promise((resolve, reject) => {
    s3Upload.on("close", resolve());
    s3Upload.on("end", resolve());
    s3Upload.on("error", reject());

    archive.pipe(streamPassThrough);
    s3FileDwnldStreams.forEach((s3FileDwnldStream) => {
      archive.append(s3FileDwnldStream.stream, {
        name: s3FileDwnldStream.fileName,
      });
    });
    archive.finalize();
  }).catch((error) => {
    throw new Error(`${error.code} ${error.message} ${error.data}`);
  });
}
