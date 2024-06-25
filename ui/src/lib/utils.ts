export function formatDuration(duration: number) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getEstimatedTimestampSeconds(cumulativeCharacterCountAtStart: number, cumulativeCharacterCountFullGroup: number, podcastDuration: number) {
    return Math.round((cumulativeCharacterCountAtStart / cumulativeCharacterCountFullGroup) * podcastDuration);
}

export function getEstimatedTimestamp(
    cumulativeCharacterCountAtStart: number,
    cumulativeCharacterCountFullGroup: number,
    podcastDuration: number
) {
    const estimatedTimestampSeconds = getEstimatedTimestampSeconds(cumulativeCharacterCountAtStart, cumulativeCharacterCountFullGroup, podcastDuration);
    const seconds = estimatedTimestampSeconds % 60;
    const minutes = Math.floor(estimatedTimestampSeconds / 60);
    return {
        raw_seconds: estimatedTimestampSeconds,
        readable: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    };
}

