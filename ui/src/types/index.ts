export interface Episode {
    title: string;
    date: string;
    chunk: string;
    progress: string;
    transcriptLink: string;
    episodeLink: string;
    episodeNumber: string;
    duration: string;
    highlights: string[];
    paragraphNumber: string;
    score: number;
    paragraphCountGroup: number;
}

export interface RequestBody {
    query: string;
    search_type: string;
    filters: {
        must: Array<{
            date_range?: {
                gt?: string | null;
                gte?: string | null;
                lt?: string | null;
                lte?: string | null;
            } | null;
            metadata?: {
                episode_number?: {
                    gte?: number;
                    lte?: number;
                };
            };
        }>;
    };
}