export function formatDuration(duration: number) {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function getProgress(cumulativeCharacterCountAtStart: number, cumulativeCharacterCountFullGroup: number, podcastDuration: number) {
    const totalSeconds = Math.round((cumulativeCharacterCountAtStart / cumulativeCharacterCountFullGroup) * podcastDuration);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return `Start listening around: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}