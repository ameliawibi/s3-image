const { zip } = require("./zipConfig");

async function streamEntryToStdOut() {
  const stm = await zip.stream("layers/top/cowboy.png");
  stm.pipe(process.stdout);
  stm.on("end", () => zip.close());
  stm.on("data", (chunk) => {
    console.log(`Base64string : ${chunk.toString("base64")}`);
  });
}

async function readFileasBuffer() {
  const data = await zip.entryData("layers/top/cowboy.png");
  console.log(data.toString("base64"));
  await zip.close();
}

streamEntryToStdOut();
readFileasBuffer();
