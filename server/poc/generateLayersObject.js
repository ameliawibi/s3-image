const { zip } = require("./zipConfig");
const fs = require("fs");
const path = require("path");
const outputPath = path.join(process.cwd(), "/server/poc");

let paths = [];

async function generateLayersObject() {
  const entriesCount = await zip.entriesCount;
  console.log(`Entries read: ${entriesCount}`);

  const entries = await zip.entries();

  for (const entry of Object.values(entries)) {
    paths.push(entry.name);
  }
  createObjectsFromPathArrays();
  // Do not forget to close the file once you're done
  await zip.close();
}

generateLayersObject();

// Extract a filename from a path
function getFilename(path) {
  return path
    .split("/")
    .filter(function (value) {
      return value && value.length;
    })
    .reverse()[0];
}
// Find sub paths
function findSubPaths(path) {
  // slashes need to be escaped when part of a regexp
  let rePath = path.replace("/", "\\/");
  let re = new RegExp("^" + rePath + "[^\\/]*\\/?$");
  return paths.filter(function (i) {
    return i !== path && re.test(i);
  });
}

// Build tree recursively
function buildTree(path) {
  path = path || "";
  //console.log(path)
  let nodeList = [];
  findSubPaths(path).forEach(function (subPath) {
    let nodeName = getFilename(subPath);
    //console.log(nodeName);
    if (/\/$/.test(subPath) && nodeName) {
      let node = {};
      node[nodeName] = buildTree(subPath);
      nodeList.push(node);
    } else {
      nodeList.push(nodeName);
    }
  });
  return nodeList;
}

function createObjectsFromPathArrays() {
  // Build tree from root
  let tree = buildTree();

  //console.log(tree);
  // By default, tree is an array
  // If it contains only one element which is an object,
  // return this object instead to match OP request
  if (tree.length == 1 && typeof tree[0] === "object") {
    tree = tree[0];
  }
  // Serialize tree for debug purposes
  //console.log(tree);
  //console.log(JSON.stringify(tree, null, 2));
  fs.writeFileSync(
    path.join(outputPath, `layers.json`),
    JSON.stringify(tree, null, 2)
  );
}
