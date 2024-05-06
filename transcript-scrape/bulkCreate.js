import * as fs from "fs";
import { createChunks } from "./trieve.js";

const chunksToCreate = fs.readFileSync("./chunksToCreate.json", "utf8");
const chunksToCreateJson = JSON.parse(chunksToCreate);

console.log(chunksToCreateJson.length);

// make groups of 120 chunks and send them to trieve
const chunkGroups = [];
chunksToCreateJson.forEach((chunk, index) => {
  if (index % 120 === 0) {
    chunkGroups.push([]);
  }

  chunkGroups[chunkGroups.length - 1].push(chunk);
});

const chunkGroupPromises = chunkGroups.map((group) => createChunks(group));

await Promise.all(chunkGroupPromises);
