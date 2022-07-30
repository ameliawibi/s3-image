const AWS = require("aws-sdk");
const { s3 } = require("../s3");
const stream = require("stream");
const yauzl = require("yauzl");

const Bucket = process.env.AWS_BUCKET_NAME;
const Key = "layers.zip";

const uploadStream = ({ Bucket, Key }) => {
  const pass = new stream.PassThrough();
  return {
    writeStream: pass,
    promise: s3.upload({ Bucket, Key, Body: pass }).promise(),
  };
};

const extractZip = (Bucket, buffer) => {
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(buffer, { lazyEntries: true }, function (err, zipfile) {
      if (err) reject(err);
      zipfile.readEntry();
      zipfile.on("entry", function (entry) {
        if (/\/$/.test(entry.fileName)) {
          // Directory entry
          // skip to the next entry
          zipfile.readEntry();
        } else {
          // file entry
          zipfile.openReadStream(entry, function (err, readStream) {
            if (err) reject(err);
            const fileNames = entry.fileName.split(".");
            const { writeStream, promise } = uploadStream({
              Bucket,
              Key: `1/1/${fileNames[0]}.${fileNames[fileNames.length - 1]}`,
            });
            readStream.pipe(writeStream);
            promise.then(() => {
              console.log(entry.fileName + " Uploaded successfully!");
              zipfile.readEntry();
            });
          });
        }
      });
      zipfile.on("end", () => resolve("end"));
    });
  });
};

const handler = async () => {
  //console.log("Received event:", JSON.stringify(event, null, 2));

  // Get the object from the event
  /*const Key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  */

  const params = { Bucket, Key };

  try {
    const object = await s3.getObject(params).promise();
    const result = await extractZip(Bucket, object.Body);

    return {
      status: result && 200,
      response: result && "OK",
    };
  } catch (err) {
    console.log(err);
    const message = `Error getting object ${Key} from bucket ${Bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    console.log(message);
    throw new Error(message);
  }
};

handler();
