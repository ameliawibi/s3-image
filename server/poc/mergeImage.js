const mergeImages = require("merge-images");
const { Canvas, Image } = require("canvas");

const path = require("path");
const outputPath = path.join(process.cwd(), "/server/poc");
const fs = require("fs");

const layers = [
  "https://raw.githubusercontent.com/lukechilds/merge-images/HEAD/test/fixtures/body.png",
  "https://raw.githubusercontent.com/lukechilds/merge-images/HEAD/test/fixtures/eyes.png",
  "https://raw.githubusercontent.com/lukechilds/merge-images/HEAD/test/fixtures/mouth.png",
];

async function mergeLayersAndSave(layers, outputFile) {
  const image = await mergeImages(layers, { Canvas: Canvas, Image: Image });
  //console.log(image);
  saveBase64Image(image, outputFile);
}

function saveBase64Image(base64PngImage, filename) {
  let base64 = base64PngImage.split(",")[1];
  //console.log(base64);
  //console.log(filename);
  let imageBuffer = Buffer.from(base64, "base64");
  //console.log(imageBuffer);
  fs.writeFileSync(filename, imageBuffer);
}

mergeLayersAndSave(layers, path.join(outputPath, "test.png"));
