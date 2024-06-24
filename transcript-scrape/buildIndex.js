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

  const container = window.document.querySelector('article .sqs-html-content');

  if (!container) {
    console.error("No element with class 'sqs-html-content' found");
    return null;
  }

  // Get all paragraphs within the container
  const p_elements = container.getElementsByTagName('p');

  // Filter out paragraphs with no text
  const paragraphs = p_elements.filter(p => p.textContent.trim());
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    chunksToCreate.push({
      group_tracking_ids: [groupTrackingId],
        tracking_id: `${groupTrackingId}-${chunkIndex}`,
        chunk_html: paragraph,
        time_stamp: new Date(timeStamp).toISOString(),
        link: groupTrackingId,
        metadata: {
          episode_number: episodeNumber,
          episode_title: episodeTitle,
      },
    });

    chunkIndex += 1;
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
