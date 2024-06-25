import { formatDuration, getEstimatedTimestamp } from './utils';
import { Episode, RequestBody } from '../types';
import { Setter } from 'solid-js';

function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout | null = null;
    return function (this: any, ...args: any[]) {
        const context = this;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            func.apply(context, args);
        }, wait);
    };
}

export const fetchSearchResults = debounce(async (
    query: string,
    searchType: string,
    episodeRangeMin: number | undefined,
    episodeRangeMax: number | undefined,
    dateRangeFrom: string | undefined,
    dateRangeTo: string | undefined,
    setEpisodes: Setter<Episode[]>,
    setIsLoading: Setter<boolean>,
    setError: Setter<string | null>
) => {
    setIsLoading(true);
    setError(null);

    try {
        let requestBody: RequestBody = {
            query: query,
            search_type: searchType,
            filters: {
                must: []
            }
        };

        // Add date range filter if dates are set
        if (dateRangeFrom || dateRangeTo) {
            const dateFilter: {
                field: string;
                date_range: {
                    gt?: string;
                    gte?: string;
                    lt?: string;
                    lte?: string;
                };
            } = {
                field: "time_stamp",
                date_range: {}
            };
            if (dateRangeFrom) dateFilter.date_range.gte = dateRangeFrom;
            if (dateRangeTo) dateFilter.date_range.lte = dateRangeTo;
            requestBody.filters.must.push(dateFilter);
        }
        // Add episode range filter if min or max is set
        if (episodeRangeMin !== undefined || episodeRangeMax !== undefined) {
            const episodeFilter: any = {
                field: "metadata.episode_number",
                range: {}
            };
            if (episodeRangeMin !== undefined) episodeFilter.range.gte = episodeRangeMin;
            if (episodeRangeMax !== undefined && episodeRangeMax !== 0) episodeFilter.range.lte = episodeRangeMax;

            if (Object.keys(episodeFilter.range).length > 0) {
                requestBody.filters.must.push(episodeFilter);
            }
        }

        console.log('Request body:', requestBody);
        const apiKey = import.meta.env.VITE_TRIEVE_API_KEY;
        const response = await fetch("https://api.trieve.ai/api/chunk/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "TR-Dataset": "7a31f610-dcff-4d4b-acb6-77b856ecf09d",
                "Authorization": `${apiKey}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API error: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();

        console.log('Data:', data);

        const episodes = (data.score_chunks || []).map((scoreChunk: any): Episode => ({
            highlights: scoreChunk?.highlights || [],
            score: scoreChunk?.score || 0,
            title: scoreChunk?.metadata?.[0]?.metadata?.episode_title || 'Untitled Episode',
            date: scoreChunk?.metadata?.[0]?.time_stamp
                ? new Date(scoreChunk.metadata[0].time_stamp).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'UTC'
                })
                : 'Unknown Date',
            chunk: scoreChunk?.metadata?.[0]?.chunk_html || 'No content available',
            episodeLink: scoreChunk?.metadata?.[0]?.link || '',
            transcriptLink: scoreChunk?.metadata?.[0]?.metadata?.transcript_link || '',
            episodeNumber: scoreChunk?.metadata?.[0]?.metadata?.episode_number || '',
            paragraphNumber: scoreChunk?.metadata?.[0]?.metadata?.paragraph_number || '',
            paragraphCountGroup: scoreChunk?.metadata?.[0]?.metadata?.paragraph_count_group || 0,
            duration: formatDuration(scoreChunk?.metadata?.[0]?.metadata?.podcast_duration),
            estimatedTimestamp: getEstimatedTimestamp(
                scoreChunk?.metadata?.[0]?.metadata?.character_count_preceeding,
                scoreChunk?.metadata?.[0]?.metadata?.character_count_group,
                scoreChunk?.metadata?.[0]?.metadata?.podcast_duration
            ),
        }));

        setEpisodes(episodes);

    } catch (error) {
        console.error('Error fetching search results:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        setEpisodes([]);
    } finally {
        setIsLoading(false);
    }
}, 300);