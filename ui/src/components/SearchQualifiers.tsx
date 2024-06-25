import { useSearch } from '../SearchContext';
import styles from './SearchQualifiers.module.css';

function SearchQualifiers() {
    const [state, { setSearchType,
        setEpisodeRangeMin,
        setEpisodeRangeMax,
        setDateRangeFrom,
        setDateRangeTo
    }] = useSearch();

    return (<>
        <div class={styles.qualifier}>
            <label>Date Range</label>
            <label class={styles.smallLabel}>From</label>
            <input
                type="date"
                value={state.dateRangeFrom || ''}
                onInput={(e) => setDateRangeFrom(e.currentTarget.value)}
            />
            <label class={styles.smallLabel}>To</label>
            <input
                type="date"
                value={state.dateRangeTo || ''}
                onInput={(e) => setDateRangeTo(e.currentTarget.value)}
            />
        </div>
        <div class={styles.qualifier}>
            <label>Search Type</label>
            <div class={styles.toggleGroup}>
                <button
                    class={`${styles.button} ${state.searchType === 'hybrid' ? styles.active : ''}`}
                    onClick={() => setSearchType('hybrid')}
                >
                    Hybrid
                </button>
                <button
                    class={`${styles.button} ${state.searchType === 'semantic' ? styles.active : ''}`}
                    onClick={() => setSearchType('semantic')}
                >
                    Semantic
                </button>
                <button
                    class={`${styles.button} ${state.searchType === 'fulltext' ? styles.active : ''}`}
                    onClick={() => setSearchType('fulltext')}
                >
                    Fulltext
                </button>
            </div>
        </div>
        <div class={styles.qualifier}>
            <label>Episode Range</label>
            <div class={styles.rangeInputGroup}>
                <div class={styles.labelRow}>
                    <label class={styles.smallLabel}>Min</label>
                    <label class={styles.smallLabel}>Max</label>
                </div>
                <div class={styles.inputRow}>
                    <input
                        class={styles.rangeInput}
                        type="number"
                        value={state.episodeRangeMin || ''}
                        onInput={(e) => setEpisodeRangeMin(+e.currentTarget.value)}
                    />
                    <input
                        class={styles.rangeInput}
                        type="number"
                        value={state.episodeRangeMax || ''}
                        onInput={(e) => setEpisodeRangeMax(+e.currentTarget.value)}
                    />
                </div>
            </div>
        </div>
    </>);
}

export default SearchQualifiers;