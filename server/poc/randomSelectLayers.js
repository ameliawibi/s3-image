const { s3 } = require("../s3");
const bucketName = process.env.AWS_BUCKET_NAME;

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

async function amelTest() {
  let layersUrl = [];
  const data = await listOfObjects();
  data.forEach((item) =>
    layersUrl.push({ fileName: item.Key, signedUrl: item.SignedUrl })
  );
  console.log(layersUrl);
}

amelTest();

/*async function listOfObjectsURL() {
  listOfObjects();

  updatedData.forEach((item) => {
    console.log(item.SignedUrl);
  });
}


listOfObjectsURL();
*/
function randomlySelectLayers(layersPath, layers) {
  const mt = MersenneTwister19937.autoSeed();

  let images = [];
  let selectedTraits = {};

  for (const layer of layers) {
    if (bool(layer.probability)(mt)) {
      let selected = pickWeighted(mt, layer.options);
      selectedTraits[layer.name] = selected.name;
      images.push(path.join(layersPath, selected.file));
    }
  }

  return {
    images,
    selectedTraits,
  };
}
