const object = {
  layers: [
    {
      top: [
        "like-a-sir.png",
        "cowboy.png",
        "einstein.png",
        "fez.png",
        "cap.png",
      ],
    },
    {
      background: ["wheat.png", "blue.png", "orange.png", "green.png"],
    },
  ],
};

const layersJson = object.layers;
let data = [];
let objectKeys = [];

for (let i = 0; i < layersJson.length; i++) {
  objectKeys.push(...Object.keys(layersJson[i]));
  for (const element of layersJson[i][objectKeys[i]]) {
    data.push({
      trait_type: objectKeys[i],
      probability: 1.0,
      subtrait: element,
      rarity: 1.0,
    });
  }
}

console.log(data);
