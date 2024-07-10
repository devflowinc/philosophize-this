import { useSearchParams } from "@solidjs/router";
import { useSearch } from "../SearchContext";
import { createEffect } from "solid-js";

export const useSearchValues = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, searchActions] = useSearch();
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
      episodeRangeMin ? parseInt(episodeRangeMin) : state.episodeRangeMin
    );
    searchActions.setEpisodeRangeMax(
      episodeRangeMax ? parseInt(episodeRangeMax) : state.episodeRangeMax
    );
    searchActions.setDateRangeFrom(dateRangeFrom);
    searchActions.setDateRangeTo(dateRangeTo);

    document.getElementById("scroller")?.addEventListener("scroll", () => {
      const scrollTop = document.getElementById("scroller")!.scrollTop;
      const clientHieght = document.getElementById("scroller")!.clientHeight;
      const scrollHeight = document.getElementById("scroller")!.scrollHeight;
      if (scrollTop + clientHieght >= scrollHeight - 200) {
        searchActions.setPageNumber(state.pageNumber + 1);
      }
    });
  });

  createEffect(() => {
    setSearchParams(state);
  });
};
