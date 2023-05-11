import Card from './Card.js'
import Video from '../components/VideoT'

function DisplayVideo(props) {

    return (
        <Card image={props.video.image}>
        <h1>{props.heading}</h1>
        <h2>Video title: {props.video.title}</h2>
        <h2>Video length: {props.video.length}</h2>
        <Video url='https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4'/>
        </Card>
    );
}

export {DisplayVideo};