export interface Episode {
  title: string;
  date: string;
  chunk: string;
  transcriptLink: string;
  episodeLink: string;
  episodeNumber: string;
  duration: string;
  highlights: string[];
  paragraphNumber: string;
  score: number;
  paragraphCountGroup: number;
  estimatedTimestamp: {
    raw_seconds: number;
    readable: string;
  };
}

export interface RequestBody {
  page: number;
  page_size: number;
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
