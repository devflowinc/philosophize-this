import { SearchProvider } from './SearchContext'; 
import { useSearch } from './SearchContext';
import SearchQualifiers from './components/SearchQualifiers'
import SearchResults from './components/SearchResults'
import styles from './App.module.css'


function App() {
  return (
    <SearchProvider>
      <AppContainer />
    </SearchProvider>
  )
}

function AppContainer() {
  const [state, { setQuery }] = useSearch();
  

  return (

    <div class={styles.app}>
      <div class={styles.searchQualifiers}>
        <div>
          <SearchQualifiers />
        </div>
      </div>
      <div class={styles.mainContent}>
        <input
          type="text"
          placeholder="Search Input Box"
          value={state.query}
          onInput={(e) => setQuery(e.currentTarget.value)}
          class={styles.searchInput}
        />
          <SearchResults />
      </div>
    </div>
  )
}

export default App