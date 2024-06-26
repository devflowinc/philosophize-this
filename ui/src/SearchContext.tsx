import { createContext, useContext, JSX } from "solid-js";
import { createStore } from "solid-js/store";

type SearchState = {
  query: string;
  searchType: string;
  episodeRangeMin: number | undefined;
  episodeRangeMax: number | undefined;
  dateRangeFrom: string | undefined;
  dateRangeTo: string | undefined;
  pageNumber: number;
};

type SearchActions = {
  setQuery: (query: string) => void;
  setSearchType: (type: string) => void;
  setEpisodeRangeMin: (min: number | undefined) => void;
  setEpisodeRangeMax: (max: number | undefined) => void;
  setDateRangeFrom: (from: string | undefined) => void;
  setDateRangeTo: (to: string | undefined) => void;
  setPageNumber: (pageNumber: number) => void;
};

type SearchStore = [SearchState, SearchActions];

const SearchContext = createContext<SearchStore | undefined>(undefined);

export function SearchProvider(props: { children: JSX.Element }) {
  const [state, setState] = createStore<SearchState>({
    query: "",
    searchType: "hybrid",
    episodeRangeMin: undefined,
    episodeRangeMax: undefined,
    dateRangeFrom: undefined,
    dateRangeTo: undefined,
    pageNumber: 1,
  });

  const store: SearchStore = [
    state,
    {
      setQuery: (query) => setState("query", query),
      setSearchType: (type) => setState("searchType", type),
      setEpisodeRangeMin: (min) => setState("episodeRangeMin", min),
      setEpisodeRangeMax: (max) => setState("episodeRangeMax", max),
      setDateRangeFrom: (from) => setState("dateRangeFrom", from),
      setDateRangeTo: (to) => setState("dateRangeTo", to),
      setPageNumber: (pageNumber) => setState("pageNumber", pageNumber),
    },
  ];

  return (
    <SearchContext.Provider value={store}>
      {props.children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
