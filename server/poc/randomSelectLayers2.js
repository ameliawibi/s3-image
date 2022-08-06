const { s3 } = require("../s3");
const bucketName = process.env.AWS_BUCKET_NAME;

const content = require("../poc/content.json");
const layers = content.layers;
const { MersenneTwister19937, bool, real } = require("random-js");

const prefix = "1/layers.zip/";

async function listOfObjects() {
  return new Promise((resolve, reject) => {
    s3.listObjects(
      {
        Bucket: bucketName,
        Prefix: prefix,
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
          resolve(updatedData);
          //return updatedData;
        }
      }
    );
  });
}

async function getLayersUrl(fileShortName, data) {
  let layersUrl = [];

  data.forEach((item) =>
    layersUrl.push({ fileName: item.Key, signedUrl: item.SignedUrl })
  );

  //console.log(layersUrl);

  const found = layersUrl
    .filter((item) => item.fileName.includes(fileShortName))
    .map((item) => item.signedUrl);

  //console.log(found[0]);

  return found[0];
}

function pickWeighted(mt, options) {
  const weightSum = options.reduce((acc, option) => {
    return acc + (option.weight ?? 1.0);
  }, 0);

  const r = real(0.0, weightSum, false)(mt);

  let summedWeight = 0.0;
  for (const option of options) {
    summedWeight += option.weight ?? 1.0;
    if (r <= summedWeight) {
      return option;
    }
  }
}

const randomlySelectLayers = async (layersArr) => {
  const mt = MersenneTwister19937.autoSeed();

  let imagesURL = [];
  let selectedTraits = {};

  const data = await listOfObjects();
  for (const layer of layersArr) {
    if (bool(layer.probability)(mt)) {
      let selected = pickWeighted(mt, layer.options);
      selectedTraits[layer.trait_type] = selected.subtrait;
      let foundUrl = await getLayersUrl(selected.subtrait, data);
      imagesURL.push(foundUrl);
    }
  }
  console.log(selectedTraits);
  console.log(imagesURL);

  return {
    imagesURL,
    selectedTraits,
  };
};

randomlySelectLayers(layers);
