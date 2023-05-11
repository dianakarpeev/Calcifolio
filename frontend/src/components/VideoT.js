// 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation.
// Hosted by archive.org.


function Video(props) {

const src = props.url;
  return (
    <video controls width="100%">
      <source src={src} type="video/mp4" />
      Sorry, your browser doesn't support embedded videos.
    </video>
  );
};

export default Video;