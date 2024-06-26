import { SearchProvider, useSearch } from "./SearchContext";
import SearchQualifiers from "./components/SearchQualifiers";
import SearchResults from "./components/SearchResults";

export const AppContainer = () => {
  const [state, { setQuery }] = useSearch();

  return (
    <SearchProvider>
      <div class="flex h-[100vh]">
        <div class="w-1/4 p-4 border-r border-gray-300">
          <SearchQualifiers />
        </div>
        <div class="w-3/4 p-4 flex flex-col">
          <input
            type="text"
            placeholder="Search Input Box"
            value={state.query}
            onInput={(e) => setQuery(e.currentTarget.value)}
            class="border border-gray-300 rounded-sm p-2 w-full focus:outline-fuchsia-500"
          />
          <SearchResults />
        </div>
      </div>
    </SearchProvider>
  );
};
