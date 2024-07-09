import { useSearch } from "../SearchContext";
import { VsClose } from "solid-icons/vs";

function SearchQualifiers() {
  const [
    state,
    {
      setSearchType,
      setEpisodeRangeMin,
      setEpisodeRangeMax,
      setDateRangeFrom,
      setDateRangeTo,
      setMenuOpen,
    },
  ] = useSearch();

  return (
    <div>
      <div class="flex flex-col gap-2 mb-4">
        <div class="flex justify-between items-center">
          <label>Date Range</label>
          <div
            class="md:hidden hover:cursor-pointer hover:bg-gray-100 rounded-full p-1"
            onClick={() => setMenuOpen(false)}
          >
            <VsClose class="h-5 w-5" />
          </div>
        </div>

        <label class="text-sm text-gray-600">From</label>
        <input
          type="date"
          value={state.dateRangeFrom || ""}
          onInput={(e) => setDateRangeFrom(e.currentTarget.value)}
          class="border border-gray-300 rounded-sm p-2 w-full focus:outline-fuchsia-500"
        />
        <label class="text-sm text-gray-600">To</label>
        <input
          type="date"
          value={state.dateRangeTo || ""}
          onInput={(e) => setDateRangeTo(e.currentTarget.value)}
          class="border border-gray-300 rounded-sm p-2 w-full focus:outline-fuchsia-500"
        />
      </div>
      <div class="flex flex-col gap-2 mb-4">
        <label>Search Type</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            classList={{
              "px-1 py-2 border border-gray-300 text-sm rounded-sm": true,
              "bg-fuchsia-100 border-fuchsia-500":
                state.searchType === "hybrid",
            }}
            onClick={() => setSearchType("hybrid")}
          >
            Hybrid
          </button>
          <button
            classList={{
              "px-2 py-2 border border-gray-300 text-sm rounded-sm": true,
              "bg-fuchsia-100 border-fuchsia-500":
                state.searchType === "semantic",
            }}
            onClick={() => setSearchType("semantic")}
          >
            Semantic
          </button>
          <button
            classList={{
              "px-2 py-2 border border-gray-300 text-sm rounded-sm": true,
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
            class="border border-gray-300 rounded-sm p-2 w-full focus:outline-fuchsia-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={state.episodeRangeMax || ""}
            onInput={(e) => setEpisodeRangeMax(+e.currentTarget.value)}
            class="border border-gray-300 rounded-sm p-2 w-full focus:outline-fuchsia-500"
          />
        </div>
      </div>
    </div>
  );
}

export default SearchQualifiers;
