import { FiMenu } from "solid-icons/fi";
import SearchQualifiers from "./SearchQualifiers";
import { useSearch } from "../SearchContext";

export default function MobileSidebar() {
  const [state, { setMenuOpen }] = useSearch();

  return (
    <div class="h-full">
      {state.menuOpen ? (
        <div class="w-full min-w-64 p-4 h-full border-r absolute bg-white border-gray-300">
          <SearchQualifiers />
        </div>
      ) : (
        <div
          class="ml-3 mt-4 rounded-full hover:cursor-pointer p-2 hover:bg-gray-100"
          onClick={() => setMenuOpen(true)}
        >
          <FiMenu class="h-6 w-6" />
        </div>
      )}
    </div>
  );
}
