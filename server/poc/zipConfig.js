const StreamZip = require("node-stream-zip");
module.exports.zip = new StreamZip.async({ file: "./server/poc/layers.zip" });
