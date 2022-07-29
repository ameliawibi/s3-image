const { s3 } = require("../s3");
const bucketName = process.env.AWS_BUCKET_NAME;

//const content = require("../poc/layers.json");
//const layersObj = content.layers;

async function listOfObjects() {
  return new Promise((resolve, reject) => {
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
          resolve(updatedData);
          //return updatedData;
        }
      }
    );
  });
}

async function getLayersUrl(fileShortName) {
  let layersUrl = [];
  const data = await listOfObjects();
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

const randomIndex = (array) => Math.floor(Math.random() * array.length);

module.exports.randomlySelectLayers = async (layersJson) => {
  let imagesURL = [];
  let selectedTraits = {};
  let objectKeys = [];
  for (let i = 0; i < layersJson.length; i++) {
    objectKeys.push(...Object.keys(layersJson[i]));

    //if object keys are not background, head, shirt the layers generated are optional at random
    if (
      Math.random() < Math.random() &&
      objectKeys[i] !== "background" &&
      objectKeys[i] !== "head" &&
      objectKeys[i] !== "shirt"
    ) {
      continue;
    }

    let arr = layersJson[i][objectKeys[i]];
    selectedTraits[objectKeys[i]] = arr[randomIndex(arr)];
    let foundUrl = await getLayersUrl(selectedTraits[objectKeys[i]]);
    imagesURL.push(foundUrl);
    //console.log(`${objectKeys[i]} : ${arr[randomIndex(arr)]}`);
  }
  //console.log(selectedTraits);
  //console.log(imagesURL);

  return {
    imagesURL,
    selectedTraits,
  };
};

//randomlySelectLayers(layersObj);
