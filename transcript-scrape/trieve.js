import {
  ChunkGroupApi,
  Configuration,
  ChunkApi,
} from "@devflowinc/trieve-js-ts-client";

const getConfiguration = () => {
  const trieveApiKey = process.env.TRIEVE_API_KEY ?? "";

  return new Configuration({
    apiKey: trieveApiKey,
    basePath: "https://api.trieve.ai",
    // basePath: "http://localhost:8090",
  });
};

export const getOrCreateChunkGroup = async (groupTrackingId) => {
  const trieveDatasetId = process.env.TRIEVE_DATASET_ID ?? "";

  const configuration = getConfiguration();
  const chunkGroupApi = new ChunkGroupApi(configuration);

  try {
    const chunkGroupRes = await chunkGroupApi.getGroupByTrackingId(
      trieveDatasetId,
      groupTrackingId
    );

    const chunkGroup = chunkGroupRes.data;

    if (chunkGroup) {
      console.log(`Found ChunkGroup: ${groupTrackingId}`);

      return chunkGroup;
    }
  } catch (e) {
    // Do nothing
  }

  try {
    const chunkGroupRes = await chunkGroupApi.createChunkGroup(
      trieveDatasetId,
      {
        name: groupTrackingId,
        tracking_id: groupTrackingId,
      }
    );

    console.log(`Created ChunkGroup: ${groupTrackingId}`);

    return chunkGroupRes.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const createChunks = async (chunks) => {
  const trieveDatasetId = process.env.TRIEVE_DATASET_ID ?? "";

  const configuration = getConfiguration();
  const chunkGroupApi = new ChunkApi(configuration);

  // modify time_stamp in chunks to be ISO 8601
  chunks.forEach((chunk) => {
    chunk.time_stamp = new Date(chunk.time_stamp).toISOString();
  });

  try {
    const chunkRes = await chunkGroupApi.createChunk(trieveDatasetId, chunks);

    console.log(`Created N Chunks: ${chunks.length}`);

    return chunkRes.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
