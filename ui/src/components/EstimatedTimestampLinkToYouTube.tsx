import { Component } from "solid-js";
import youtubeData from "../data/podcast_episodes_mapped_to_youtube.json";
import { FiExternalLink } from "solid-icons/fi";

interface EstimatedTimestampLinkToYouTubeProps {
  episodeNumber: string;
  estimatedTimestamp: {
    raw_seconds: number;
    readable: string;
  };
}

const EstimatedTimestampLinkToYouTube: Component<
  EstimatedTimestampLinkToYouTubeProps
> = (props) => {
  const youtubeLink = youtubeData.find(
    (e) => e.episode_number === parseInt(props.episodeNumber)
  )?.link;

  if (!youtubeLink) return null;

  const timestampedLink = `${youtubeLink}&t=${Math.floor(
    props.estimatedTimestamp.raw_seconds
  )}`;

  return (
    <p class="text-sm text-zinc-600">
      <a
        href={timestampedLink}
        target="_blank"
        rel="noopener noreferrer"
        class="flex space-x-1 text-sm items-center gap-1 hover:text-fuchsia-500"
      >
        Est. {props.estimatedTimestamp.readable}
        <FiExternalLink class="inline" />
      </a>
    </p>
  );
};

export default EstimatedTimestampLinkToYouTube;
