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
    <div class="flex flex-wrap justify-between items-end">
      <div class="flex flex-col gap-2">
        <label class="text-sm text-zinc-400">Date Range</label>
        <div class="flex gap-2">
          <input
            aria-label="From"
            type="date"
            value={state.dateRangeFrom || ""}
            onInput={(e) => setDateRangeFrom(e.currentTarget.value)}
            class="border border-zinc-300 rounded-sm p-2 w-full focus:outline-fuchsia-500"
          />

          <input
            aria-label="To"
            type="date"
            value={state.dateRangeTo || ""}
            onInput={(e) => setDateRangeTo(e.currentTarget.value)}
            class="border border-zinc-300 rounded-sm p-2 w-full focus:outline-fuchsia-500"
          />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm text-zinc-400">Search Type</label>
        <span class="isolate flex rounded-md shadow-sm w-full">
          {["hybrid", "semantic", "fulltext"].map((type, i) => (
            <button
              type="button"
              classList={{
                "relative text-capitalize -ml-px inline-flex items-center p-3 text-sm font-semibold text-zinc-900 ring-1 ring-inset focus:z-10 transition-colors grow justify-center":
                  true,
                "rounded-l-md": i === 0,
                "rounded-r-md": i === 2,
                "bg-fuchsia-400 ring-fuchsia-500 text-white":
                  state.searchType === type,
                "bg-white hover:bg-zinc ring-zinc-300":
                  state.searchType !== type,
              }}
              onClick={() => setSearchType(type)}
            >
              {type}
            </button>
          ))}
        </span>
      </div>
      <div class="flex flex-col gap-4">
        <label class="text-sm text-zinc-400">Episode Range</label>
        <div class="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Min"
            value={state.episodeRangeMin || ""}
            onInput={(e) => setEpisodeRangeMin(+e.currentTarget.value)}
            class="border border-zinc-300 rounded-sm p-2 w-full focus:outline-fuchsia-500"
            min={1}
          />
          <input
            type="number"
            placeholder="Max"
            value={state.episodeRangeMax || ""}
            onInput={(e) => setEpisodeRangeMax(+e.currentTarget.value)}
            class="border border-zinc-300 rounded-sm p-2 w-full focus:outline-fuchsia-500"
            max={192}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchQualifiers;
