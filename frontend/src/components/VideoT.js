import ReactPlayer from 'react-player';
function Video(props) {

const src = props.url;
  return (
    <ReactPlayer width="100%" controls="true" url={src}></ReactPlayer>
  );
};

export default Video;