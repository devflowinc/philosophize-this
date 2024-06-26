import { For, createEffect, createSignal } from "solid-js";
import { useSearch } from "../SearchContext";
import { fetchSearchResults } from "../lib/fetchSearchResults";
import EstimatedTimestampLinkToYouTube from "./EstimatedTimestampLinkToYouTube";
import { Episode } from "../types";
import { FiExternalLink } from "solid-icons/fi";
import { BsDot } from "solid-icons/bs";
import { useSearchParams } from "@solidjs/router";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, searchActions] = useSearch();
  const [episodes, setEpisodes] = createSignal<Episode[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);

  createEffect(() => {
    // pull data from searchParams
    const {
      query,
      searchType,
      episodeRangeMin,
      episodeRangeMax,
      dateRangeFrom,
      dateRangeTo,
    } = searchParams;

    searchActions.setQuery(query || "");
    searchActions.setSearchType(searchType || "hybrid");
    searchActions.setEpisodeRangeMin(
      episodeRangeMin ? parseInt(episodeRangeMin) : undefined
    );
    searchActions.setEpisodeRangeMax(
      episodeRangeMax ? parseInt(episodeRangeMax) : undefined
    );
    searchActions.setDateRangeFrom(dateRangeFrom);
    searchActions.setDateRangeTo(dateRangeTo);
  });

  createEffect(() => {
    const {
      query,
      searchType,
      episodeRangeMin,
      episodeRangeMax,
      dateRangeFrom,
      dateRangeTo,
    } = state;

    setSearchParams({
      query,
      searchType,
      episodeRangeMin,
      episodeRangeMax,
      dateRangeFrom,
      dateRangeTo,
    });

    fetchSearchResults(
      query,
      searchType,
      episodeRangeMin,
      episodeRangeMax,
      dateRangeFrom,
      dateRangeTo,
      setEpisodes,
      setIsLoading
    );
  });

  return (
    <div class="mt-4">
      <div
        classList={{
          "grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4": true,
          "animate-pulse": isLoading(),
        }}
      >
        <For each={episodes()}>
          {(episode) => (
            <div class="border border-fuchsia-200 p-4 rounded-sm relative">
              <div class="mt-1">
                <a
                  href={episode.episodeLink}
                  class="font-bold mb-0 hover:underline hover:text-fuchsia-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h3>{episode.title}</h3>
                </a>
              </div>
              <div class="flex flex-wrap items-center gap-1 mt-1">
                <p class="text-sm text-gray-600">{episode.date}</p>
                <p>
                  <BsDot class="w-3 h-3" />
                </p>
                <EstimatedTimestampLinkToYouTube
                  episodeNumber={episode.episodeNumber}
                  estimatedTimestamp={episode.estimatedTimestamp}
                />
                <p>
                  <BsDot class="w-3 h-3" />
                </p>
                <a
                  class="text-sm text-gray-600 hover:text-fuchsia-500"
                  href={episode.transcriptLink}
                >
                  Transcript <FiExternalLink class="inline" />
                </a>
              </div>
              <div class="mt-2" innerHTML={episode.chunk} />
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default SearchResults;
