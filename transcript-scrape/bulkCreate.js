import * as fs from "fs";
import { createChunks } from "./trieve.js";

const chunksToCreate = fs.readFileSync("./chunksToCreate.json", "utf8");
let chunksToCreateJson = JSON.parse(chunksToCreate);

// make groups of 120 chunks and send them to trieve
const chunkGroups = [];

// filter small chunks
chunksToCreateJson = chunksToCreateJson.filter((chunk) => chunk.chunk_html.split(" ").length > 5)


chunksToCreateJson.forEach((chunk, index) => {
	console.log(chunk);
  if (index % 120 === 0) {
    chunkGroups.push([]);
  }

  chunkGroups[chunkGroups.length - 1].push(chunk);
});

const chunkGroupPromises = chunkGroups.map((group) => createChunks(group));

await Promise.all(chunkGroupPromises);
