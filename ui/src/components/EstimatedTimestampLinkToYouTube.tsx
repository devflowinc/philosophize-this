import { Component } from 'solid-js';
import styles from './SearchResults.module.css';
import youtubeData from '../data/podcast_episodes_mapped_to_youtube.json';
import { AiFillYoutube } from 'solid-icons/ai'

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
    (e) => e.episode_number === parseInt(props.episodeNumber))?.link;

  if (!youtubeLink) return null;

  const timestampedLink = `${youtubeLink}&t=${Math.floor(
    props.estimatedTimestamp.raw_seconds
  )}`;

  return (
    <p class={styles.progress}>
      Estimated timestamp:{' '}
      <a class={styles.link} href={timestampedLink} target="_blank" rel="noopener noreferrer">
        {props.estimatedTimestamp.readable}
        <AiFillYoutube class={styles.youtubeIcon} />
      </a>
    </p>
  );
};

export default EstimatedTimestampLinkToYouTube;
