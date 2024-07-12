import { For, Show, createEffect, createSignal } from "solid-js";
import { useSearch } from "../SearchContext";
import { fetchSearchResults } from "../lib/fetchSearchResults";
import type { Episode } from "../types";
import { Loading } from "./Loading";
import { useSearchValues } from "../hooks/searchParams";
import { EpisodeCard } from "./Episode";

const SearchResults = () => {
  useSearchValues();

  const [state] = useSearch();
  const [episodes, setEpisodes] = createSignal<Episode[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);

  createEffect(() => {
    const {
      query,
      searchType,
      episodeRangeMin,
      episodeRangeMax,
      dateRangeFrom,
      dateRangeTo,
      pageNumber,
    } = state;

    fetchSearchResults(
      query,
      searchType,
      episodeRangeMin,
      episodeRangeMax,
      dateRangeFrom,
      dateRangeTo,
      pageNumber,
      setEpisodes,
      setIsLoading
    );
  });

  return (
    <div class="my-4 overflow-y-scroll" id="scroller">
      {isLoading() ? (
        <Loading />
      ) : (
        <>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
            <Show when={episodes().length}>
              <For each={episodes()}>
                {(episode) => <EpisodeCard episode={episode} />}
              </For>
            </Show>
          </div>
          <Show when={!episodes().length}>
            <div class="items-center justify-center w-full flex mt-12">
              Anything? Yes! Search for anything you heard on the show and we
              will take you straight to it
            </div>
          </Show>
        </>
      )}
    </div>
  );
};

export default SearchResults;
