import { BiRegularFilter } from "solid-icons/bi";
import { useSearch } from "./SearchContext";
import SearchQualifiers from "./components/SearchQualifiers";
import SearchResults from "./components/SearchResults";
import { createSignal } from "solid-js";

export const AppContainer = () => {
  const [state, { setQuery }] = useSearch();
  const [filters, setFilters] = createSignal(false);

  const toggleFilters = () => setFilters((e) => !e);

  return (
    <div class=" h-[100vh] bg-zinc-50">
      <header class="flex items-center justify-center my-8">
        <img src="./logo.png" />
      </header>
      <main class="container mx-auto">
        <input
          type="text"
          placeholder="Search for anything"
          value={state.query}
          onInput={(e) => setQuery(e.currentTarget.value)}
          class="border border-zinc-300 w-full focus:outline-fuchsia-500 rounded-lg mt-8 p-4 mb-4"
        />

        <div>
          <button class="flex gap-2 items-center" onClick={toggleFilters}>
            <BiRegularFilter /> Filters
          </button>

          {filters() && <SearchQualifiers />}
        </div>

        <section>
          <SearchResults />
        </section>
      </main>
    </div>
  );
};
