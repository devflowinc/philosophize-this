import * as fs from "fs";
import { createChunks } from "./trieve.js";

const twoKChunks = fs.readFileSync("./twoKTokenChunks.json", "utf8");
const twoKChunksJson = JSON.parse(twoKChunks);

console.log(twoKChunksJson.length);

await createChunks(twoKChunksJson);
