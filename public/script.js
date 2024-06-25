document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    const searchQueryForm = document.getElementById('searchQuery');
    const searchQualifiersForm = document.getElementById('searchQualifiers');
    const resultsContainer = document.getElementById('results');

    if (!searchQueryForm || !searchQualifiersForm) {
        console.error("Forms not found");
        return;
    }

    searchQueryForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log("Form submitted");

        const query = document.getElementById('searchInput').value;
        const searchType = document.getElementById('searchType').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const episodeRange = document.getElementById('episodeRange').value;

        if (!query || !searchType) {
            console.error("Query or search type is missing");
            return;
        }

        let filters = {
            jsonb_prefilter: true,
            must: []
        };

        if (startDate || endDate) {
            filters.must.push({
                date_range: {
                    gte: startDate || null,
                    lte: endDate || null
                }
            });
        }

        const requestBody = {
            query: query,
            search_type: searchType,
            episode_range: episodeRange,
            filters: filters
        };

        console.log("Request Body:", JSON.stringify(requestBody));

        fetch("https://api.trieve.ai/api/chunk/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "TR-Dataset": "7a31f610-dcff-4d4b-acb6-77b856ecf09d",
                "Authorization": "tr-379B3quoVBERWs7buFbifiNNan33m0Cg"
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                resultsContainer.innerHTML = '';

                if (!data.score_chunks || data.score_chunks.length === 0) {
                    resultsContainer.innerHTML = '<p>No results found</p>';
                    return;
                }

                data.score_chunks.forEach(scoreChunk => {
                    scoreChunk.metadata.forEach(chunk => {
                        const episodeDiv = document.createElement('div');
                        episodeDiv.className = 'episode';
                        episodeDiv.innerHTML = `
                            <h3><a href="${chunk?.link}" target="_blank">
                                ${chunk.metadata?.episode_title || 'Untitled Episode'}
                            </a></h3>
                            <p>
                                ${chunk.time_stamp 
                                    ? new Date(chunk.time_stamp).toLocaleString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                        timeZone: 'UTC'
                                    })
                                    : 'Unknown Date'}
                            </p>
                            <div style="border: 1px solid #ccc; padding: 10px;">
                                ${chunk.chunk_html || chunk.content || 'No content available'}
                            </div>
                            <p>
                                <a href="${chunk?.link.replace('/podcast/', '/transcript/').split('/').slice(0, -1).join('/') + '/' + chunk?.link.split('/').pop().split('-').slice(0, 2).join('-') + '-transcript#:~:text=' + encodeURIComponent(chunk.highlights?.[0]?.text)}" target="_blank" style="color: blue;">
                                    Transcript Paragraph #${chunk.metadata?.paragraph_number}
                                </a>
                            </p>
                            <p>
                                ${chunk.metadata?.cumulative_character_count_at_start && 
                                  chunk.metadata?.cumulative_character_count_full_group 
                                  ? `Check around: ${((chunk.metadata.cumulative_character_count_at_start / 
                                  chunk.metadata.cumulative_character_count_full_group) * 
                                  chunk.metadata.podcast_duration / 60).toFixed(2)} minutes`
                                  : 'Progress: Unknown'}
                            </p>
                        `;
                        resultsContainer.appendChild(episodeDiv);
                    });
                });
            })
            .catch(error => {
                console.error('Error:', error);
                resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
            });
    });
});