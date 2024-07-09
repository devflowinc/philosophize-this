import { useSearch } from "../SearchContext";
import SearchQualifiers from "./SearchQualifiers";
import { FaSolidChevronRight, FaSolidChevronLeft } from "solid-icons/fa";

export const Collapsable = () => {
  const [state, { setSidebarOpen }] = useSearch();

  return (
    <>
      {state.sidebarOpen ? (
        <div class="hidden w-1/4 min-w-72 border-r md:flex border-gray-300">
          <div class=" p-4 pr-1">
            <SearchQualifiers />
          </div>
          <div
            onClick={() => setSidebarOpen(false)}
            class="hidden  w-10 h-full md:items-center ml-2 hover:cursor-pointer hover:bg-gray-100  md:justify-center md:flex border-gray-300"
          >
            <FaSolidChevronLeft />
          </div>
        </div>
      ) : (
        <div
          onClick={() => setSidebarOpen(true)}
          class="hidden  w-10 bg-gray-50 hover:bg-gray-100 hover:cursor-pointer h-full p-4 border-r md:items-center  md:justify-center md:flex border-gray-300"
        >
          <FaSolidChevronRight />
        </div>
      )}
    </>
  );
};
