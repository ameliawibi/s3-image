const mergeImages = require("merge-images");
const { Canvas, Image } = require("canvas");
const path = require("path");
const outputPath = path.join(process.cwd(), "/server/poc");
const fs = require("fs");
const { randomlySelectLayers } = require("./randomSelectLayers");
const content = require("../poc/layers.json");
const layersObj = content.layers;

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

generateNFTs(2, outputPath);
