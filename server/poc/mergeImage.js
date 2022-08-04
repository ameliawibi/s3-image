const mergeImages = require("merge-images");
const { Canvas, Image } = require("canvas");
const path = require("path");
const outputPath = path.join(process.cwd(), "/server/poc");
const fs = require("fs");
const { s3 } = require("../s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const { randomlySelectLayers } = require("./randomSelectLayers");
const content = require("../poc/layers.json");
const layersObj = content.layers;

async function mergeLayersAndSave(layers, outputFile) {
  const image = await mergeImages(layers, { Canvas: Canvas, Image: Image });
  //console.log(image);
  //saveBase64Image(image, outputFile);
  uploadToS3(image, outputFile);
}

function saveBase64Image(base64PngImage, filename) {
  let base64 = base64PngImage.split(",")[1];
  //console.log(base64);
  //console.log(filename);
  let imageBuffer = Buffer.from(base64, "base64");
  //console.log(imageBuffer);

  fs.writeFileSync(filename, imageBuffer);
}

function uploadToS3(base64PngImage, filename) {
  let base64 = base64PngImage.split(",")[1];
  let imageBuffer = new Buffer.from(base64, "base64");
  console.log(imageBuffer);
  s3.upload(
    {
      Bucket: bucketName,
      Key: filename,
      Body: imageBuffer,
      ContentEncoding: "base64",
      ContentType: "image/png",
    },
    function (err, data) {
      if (err) {
        console.log(err);
        console.log("Error uploading data: ", data);
      } else {
        console.log("succesfully uploaded the image!");
      }
    }
  );
}

async function generateNFTs(num, outputpath) {
  let generated = new Set();

  for (let i = 0; i < num; i++) {
    console.log(`Generating NFT #${i}`);
    let selection = await randomlySelectLayers(layersObj);

    const traitsGenerated = JSON.stringify(selection.selectedTraits);

    if (generated.has(traitsGenerated)) {
      console.log(`Duplicate NFT found. Skip...`);
      i--;
      continue;
    } else {
      generated.add(traitsGenerated);
      await mergeLayersAndSave(
        selection.imagesURL,
        path.join(outputpath, `${i}.png`)
      );
      //path.join(outputpath, `${i}.png`)
      let metadata = generateMetadata(i, selection.selectedTraits);

      console.log(metadata);
    }
  }
}

function generateMetadata(tokenId, traits) {
  let attributes = [];
  for (const [trait_type, value] of Object.entries(traits)) {
    attributes.push({ trait_type, value });
  }
  return { tokenId, attributes };
}

//generateNFTs(2, outputPath);
generateNFTs(2, "1/layers.zip/nft/");
