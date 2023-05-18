import Card from './Card.js'
import Video from '../components/VideoT'

function DisplayVideo(props) {

    return (
        <Card image={props.video.image}>
        <h1>{props.heading}</h1>
        <h2>{props.video.title}</h2>
        <Video url= {props.video.url}/>
        </Card>
    );
}

export {DisplayVideo};