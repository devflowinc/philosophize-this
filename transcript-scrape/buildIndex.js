import * as fs from "fs";
import { Window } from "happy-dom";
import { splitHTMLByHeadings } from "./chunker.js";
import { createChunks, getOrCreateChunkGroup } from "./trieve.js";

let twoKTokenChunks = [];

const window = new Window();

const handleNavGroup = async (
  transcriptLink,
  groupTrackingId,
  episodeNumber,
  episodeTitle
) => {
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

    if (currentChunkWordCount >= 2000) {
      twoKTokenChunks.push({
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

  // for (const [groupTrackingId, pages] of Object.entries(groupPagesMap)) {
  //   await getOrCreateChunkGroup(groupTrackingId);

  //   let chunksToCreate = [];

  //   for (const page of pages) {
  //     const pageMarkdownText = fs.readFileSync(
  //       `./tmp/docs/${page}.mdx`,
  //       "utf8"
  //     );

  //     const pageHtml = micromark(pageMarkdownText, {
  //       extensions: [mdx()],
  //     });

  //     const htmlBlocks = splitHTMLByHeadings(window, pageHtml);

  //     for (const htmlBlock of htmlBlocks) {
  //       const { tracking_id, chunk_html } = htmlBlock;

  //       const uniqueTrackingId = `${page}|${tracking_id}`;

  //       chunksToCreate.push({
  //         group_tracking_ids: [groupTrackingId],
  //         uniqueTrackingId,
  //         chunk_html,
  //         upsert_by_tracking_id: true,
  //         tag_set: tracking_id.split("/"),
  //         split_avg: true,
  //         link: `https://mintlify.com/docs/${page}#${tracking_id}`,
  //       });
  //     }
  //   }

  //   createChunks(chunksToCreate);
  // }
};

const episodeLinksJsonText = fs.readFileSync("./episodeLinks.json", "utf8");
const episodeLinksJson = JSON.parse(episodeLinksJsonText);

const transcriptLinksJsonText = fs.readFileSync(
  "./transcriptLinks.json",
  "utf8"
);
const transcriptLinksJson = JSON.parse(transcriptLinksJsonText);

const wrote = false;

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

  // if twoKTokenChunks.length >= 500 then save to file and clear the array and exit
  if (twoKTokenChunks.length >= 500) {
    fs.writeFileSync(
      "./twoKTokenChunks.json",
      JSON.stringify(twoKTokenChunks, null, 2),
      "utf8"
    );

    twoKTokenChunks = [];

    wrote = true;
    break;
  }
}

if (!wrote) {
  fs.writeFileSync(
    "./twoKTokenChunks.json",
    JSON.stringify(twoKTokenChunks, null, 2),
    "utf8"
  );
}