import { useSearch } from "./SearchContext";
import SearchQualifiers from "./components/SearchQualifiers";
import SearchResults from "./components/SearchResults";

export const AppContainer = () => {
  const [state, { setQuery }] = useSearch();

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
          class="border border-zinc-300 p-2 w-full focus:outline-fuchsia-500 rounded-md my-8"
        />
        <section class="flex gap-4">
          <div class="w-1/4 border-zinc-300">
            <SearchQualifiers />
          </div>
          <div class="w-3/4  flex flex-col">
            <SearchResults />
          </div>
        </section>
      </main>
    </div>
  );
};
