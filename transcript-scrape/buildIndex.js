import * as fs from "fs";
import { Window } from "happy-dom";
import { getOrCreateChunkGroup } from "./trieve.js";

let chunksToCreate = [];

const window = new Window();

const handleNavGroup = async (
  transcriptLink,
  groupTrackingId,
  episodeNumber,
  episodeTitle
) => {
  await getOrCreateChunkGroup(groupTrackingId);

  // fetch request to transcriptLink to get the transcript
  const transcriptRes = await fetch(transcriptLink);
  const transcriptText = await transcriptRes.text();
  window.document.body.innerHTML = transcriptText;

  const timeStamp = window.document.querySelector(
    'head > meta[itemprop="datePublished"]'
  ).content;

  const innerContent = window.document.querySelector(
    "article .sqs-html-content"
  ).innerText;

  // construct groups of 2k words where the last group can be less than 2k words
  const words = innerContent.split(" ");
  let currentChunk = "";
  let currentChunkWordCount = 0;
  let chunkIndex = 0;

  for (const word of words) {
    currentChunk += word + " ";
    currentChunkWordCount += 1;

    if (currentChunkWordCount >= 200) {
      chunksToCreate.push({
        group_tracking_ids: [groupTrackingId],
        tracking_id: `${groupTrackingId}-${chunkIndex}`,
        chunk_html: currentChunk,
        time_stamp: new Date(timeStamp).toISOString(),
        link: groupTrackingId,
        metadata: {
          episode_number: episodeNumber,
          episode_title: episodeTitle,
        },
      });

      currentChunk = "";
      currentChunkWordCount = 0;
      chunkIndex += 1;
    }
  }
};

const episodeLinksJsonText = fs.readFileSync("./episodeLinks.json", "utf8");
const episodeLinksJson = JSON.parse(episodeLinksJsonText);

const transcriptLinksJsonText = fs.readFileSync(
  "./transcriptLinks.json",
  "utf8"
);
const transcriptLinksJson = JSON.parse(transcriptLinksJsonText);

for (const episodeLink of episodeLinksJson) {
  const transcriptLink = transcriptLinksJson.find(
    (tl) => tl.tsNum === episodeLink.epNum
  );

  if (!transcriptLink) {
    console.log(`No transcript found for episode ${episodeLink.epNum}`);
    continue;
  }

  await handleNavGroup(
    transcriptLink.link,
    episodeLink.link,
    episodeLink.epNum,
    episodeLink.title
  );
}

fs.writeFileSync(
  "./chunksToCreate.json",
  JSON.stringify(chunksToCreate, null, 2),
  "utf8"
);
