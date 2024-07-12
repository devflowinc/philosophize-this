import { FiExternalLink } from "solid-icons/fi";
import EstimatedTimestampLinkToYouTube from "./EstimatedTimestampLinkToYouTube";
import { BsDot } from "solid-icons/bs";
import type { Episode } from "../types";
import { Show } from "solid-js";

export const EpisodeCard = ({ episode }: { episode: Episode }) => {
  if (!episode?.episodeLink || !episode?.transcriptLink) return null;
  return (
    <a
      class="border-fuchsia-200 border-4 p-4  relative bg-white rounded-md shadow-none transition-all hover:border-fuchsia-400 hover:shadow-md flex flex-col justify-between"
      href={episode?.episodeLink ?? ""}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div>
        <div class="mt-1">
          <h3 class="font-mono text-xl">#{episode.episodeNumber}</h3>

          <h4 class="font-bold mb-0 hover:underline hover:text-fuchsia-500">
            {episode.title.split(" - ")[1]}
          </h4>
        </div>
        <div class="flex flex-wrap items-center gap-1 mt-1">
          <p class="text-sm text-zinc-600">{episode.date}</p>
        </div>
        <div class="mt-2 line-clamp-4" innerHTML={episode.chunk} />
      </div>
      <footer class="flex gap-1 items-center pt-4">
        <EstimatedTimestampLinkToYouTube
          episodeNumber={episode.episodeNumber}
          estimatedTimestamp={episode.estimatedTimestamp}
        />

        <BsDot class="w-3 h-3" />

        <Show when={episode.transcriptLink}>
          {(link) => (
            <a
              class="text-sm text-zinc-600 hover:text-fuchsia-500"
              href={link()}
            >
              Transcript <FiExternalLink class="inline" />
            </a>
          )}
        </Show>
      </footer>
    </a>
  );
};
