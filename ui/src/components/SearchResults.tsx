import { For, createEffect, createSignal } from 'solid-js';
import { useSearch } from '../SearchContext';
import styles from './SearchResults.module.css';
import { fetchSearchResults } from '../lib/fetchSearchResults';
import { Episode } from '../types';

function SearchResults() {
    const [state] = useSearch();
    const [episodes, setEpisodes] = createSignal<Episode[]>([]);
    const [isLoading, setIsLoading] = createSignal(false);
    const [error, setError] = createSignal<string | null>(null);

    createEffect(() => {
        const { query, searchType, episodeRangeMin, episodeRangeMax, dateRangeFrom, dateRangeTo } = state;
        if (query !== "") {
            fetchSearchResults(
                query,
                searchType,
                episodeRangeMin,
                episodeRangeMax,
                dateRangeFrom,
                dateRangeTo,
                setEpisodes,
                setIsLoading,
                setError
            );
        }
    });

    return (
        <>
            {(state.query || episodes().length > 0) && (
                <p class={styles.resultsCount}>{episodes().length} results</p>
            )}
            {isLoading() && <p>Loading...</p>}
            {error() && <p class={styles.error}>{error()}</p>}
            <div class={styles.results}>
                <For each={episodes()}>
                    {(episode) => (
                    <div class={styles.episode}>
                        <a href={episode.episodeLink} class={styles.title} target="_blank" rel="noopener noreferrer">
                            <h3>{episode.title}</h3>
                        </a>
                        <p class={styles.date}>{episode.date}</p>
                        <div class={styles.chunk} innerHTML={episode.chunk} />
                        <p class={styles.paragraphNumber}>Chunk {episode.paragraphNumber} of {episode.paragraphCountGroup}</p>
                        <p class={styles.progress}>Episode length: {episode.duration}</p>
                        <p class={styles.progress}>{episode.progress}</p>
                        <a class={styles.transcriptLink} href={episode.transcriptLink} target="_blank">View transcript</a>
                        <p class={styles.score}>score: {episode.score.toFixed(2)}</p>
                    </div>
                )}
                </For>
            </div>
            
        </>
    )
}

export default SearchResults;   