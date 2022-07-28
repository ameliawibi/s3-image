const { s3 } = require("../s3");
const bucketName = process.env.AWS_BUCKET_NAME;

const content = require("../poc/layers.json");
const layersObj = content.layers;

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

async function getLayersUrl() {
  let layersUrl = [];
  const data = await listOfObjects();
  data.forEach((item) =>
    layersUrl.push({ fileName: item.Key, signedUrl: item.SignedUrl })
  );
  //console.log(layersUrl);
}

getLayersUrl();

const randomIndex = (array) => Math.floor(Math.random() * array.length);

function randomlySelectLayers(layersObj) {
  //console.log(layersObj);
  let images = [];
  let selectedTraits = {};
  let objectKeys = [];
  for (let i = 0; i < layersObj.length; i++) {
    objectKeys.push(...Object.keys(layersObj[i]));
    let arr = layersObj[i][objectKeys[i]];
    console.log(`${objectKeys[i]} : ${arr[randomIndex(arr)]}`);
  }
  //console.log(objectKeys);

  return {
    images,
    selectedTraits,
  };
}

randomlySelectLayers(layersObj);
