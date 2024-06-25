See ui/ for the searchable interface.
See transcript-scrape/ for the scraping and ingesting

# Matching of transcripts to YouTube videos

See map_episodes_to_youtube.py for the matching of transcripts to YouTube videos
podcast_links_and_titles.txt is the input file created via this:

```
youtube-dl -j --flat-playlist "https://www.youtube.com/playlist?list=PLaqiwaqzNEgEOqGaC1zFpsis30tiWuZVo" | jq -r '"https://www.youtube.com/watch?v=\(.id) \(.title)"' > podcast_links_and_titles.txt
```

podcast_episodes_mapped_to_youtube.json is the output file

This is used in the ui/ to create links to estimated timestamps for chunk in the results, in this format (where `t` is seconds): 
```
https://youtu.be/i1JplU2LPxY?si=4S7bPVKLVGY-DHy-&t=558
```