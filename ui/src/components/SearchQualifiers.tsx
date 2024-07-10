import { useSearch } from "../SearchContext";

function SearchQualifiers() {
  const [
    state,
    {
      setSearchType,
      setEpisodeRangeMin,
      setEpisodeRangeMax,
      setDateRangeFrom,
      setDateRangeTo,
    },
  ] = useSearch();

  return (
    <div>
      <div class="flex flex-col gap-2 mb-4">
        <label>Date Range</label>
        <div class="flex gap-2">
          <div>
            <label class="text-sm text-zinc-600">From</label>
            <input
              type="date"
              value={state.dateRangeFrom || ""}
              onInput={(e) => setDateRangeFrom(e.currentTarget.value)}
              class="border border-zinc-300 rounded-sm p-2 w-full focus:outline-fuchsia-500"
            />
          </div>
          <div>
            <label class="text-sm text-zinc-600">To</label>
            <input
              type="date"
              value={state.dateRangeTo || ""}
              onInput={(e) => setDateRangeTo(e.currentTarget.value)}
              class="border border-zinc-300 rounded-sm p-2 w-full focus:outline-fuchsia-500"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label>Search Type</label>
        <div class="grid grid-cols-3 gap-4">
          <button
            classList={{
              "px-2 py-4 border border-zinc-300 rounded-sm": true,
              "bg-fuchsia-100 border-fuchsia-500":
                state.searchType === "hybrid",
            }}
            onClick={() => setSearchType("hybrid")}
          >
            Hybrid
          </button>
          <button
            classList={{
              "px-2 py-4 border border-zinc-300 rounded-sm": true,
              "bg-fuchsia-100 border-fuchsia-500":
                state.searchType === "semantic",
            }}
            onClick={() => setSearchType("semantic")}
          >
            Semantic
          </button>
          <button
            classList={{
              "px-2 py-4 border border-zinc-300 rounded-sm": true,
              "bg-fuchsia-100 border-fuchsia-500":
                state.searchType === "fulltext",
            }}
            onClick={() => setSearchType("fulltext")}
          >
            Fulltext
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <label>Episode Range</label>
        <div class="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Min"
            value={state.episodeRangeMin || ""}
            onInput={(e) => setEpisodeRangeMin(+e.currentTarget.value)}
            class="border border-zinc-300 rounded-sm p-2 w-full focus:outline-fuchsia-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={state.episodeRangeMax || ""}
            onInput={(e) => setEpisodeRangeMax(+e.currentTarget.value)}
            class="border border-zinc-300 rounded-sm p-2 w-full focus:outline-fuchsia-500"
          />
        </div>
      </div>
    </div>
  );
}

export default SearchQualifiers;
