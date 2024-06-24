import * as fs from "fs";
import { Window } from "happy-dom";
import { getOrCreateChunkGroup } from "./trieve.js";
import puppeteer from 'puppeteer';

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
  const p_elements = Array.from(container.getElementsByTagName('p'));

  // Filter out paragraphs with no text
  const paragraphs = p_elements.filter(p => p.textContent.trim());
  let chunkIndex = 0;

  const podcastDuration = await getPodcastDuration(groupTrackingId);
  let cumulativeCharacterCount = 0
  for (const paragraph of paragraphs) {
    // get the cumulative character count of all previous paragraphs
    

    chunksToCreate.push({
      group_tracking_ids: [groupTrackingId],
      tracking_id: `${groupTrackingId}-${chunkIndex}`,
      chunk_html: paragraph.innerHTML,
      time_stamp: new Date(timeStamp).toISOString(),
      link: groupTrackingId,
      upsert_by_tracking_id: true,
      metadata: {
        episode_number: episodeNumber,
        episode_title: episodeTitle,
        paragraph_number: chunkIndex,
        character_count: paragraph.textContent.length,
        cumulative_character_count_at_start: cumulativeCharacterCount,
        podcast_duration: podcastDuration,
      },
    });

    chunkIndex += 1;
    cumulativeCharacterCount += paragraph.textContent.length;
  }
};

async function getPodcastDuration(url) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url);

    // Find the sqs-audio-embed element and extract the audio URL
    const audioUrl = await page.evaluate(() => {
      const audioEmbedElement = document.querySelector('.sqs-audio-embed');
      return audioEmbedElement ? audioEmbedElement.getAttribute('data-url') : null;
    });

    if (!audioUrl) {
      throw new Error('Audio URL not found');
    }

    // Create an audio element dynamically and get the duration
    const durationHandle = await page.evaluateHandle((audioUrl) => {
      return new Promise((resolve, reject) => {
        const audio = document.createElement('audio');
        audio.src = audioUrl;
        audio.addEventListener('loadedmetadata', () => {
          resolve(audio.duration);
        });
        audio.addEventListener('error', (e) => {
          reject(new Error('Failed to load audio metadata'));
        });
      });
    }, audioUrl);

    const duration = await durationHandle.jsonValue();
    await durationHandle.dispose();

    if (duration === null) {
      throw new Error(`Failed to retrieve duration for ${url}`);
    } else {
      console.log(`Duration: ${duration} seconds for ${url}`);
    }

    return duration;
  } catch (error) {
    console.error(`Error in getPodcastDuration: ${error.message}`);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

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
