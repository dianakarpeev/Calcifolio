import {Card} from './Card'

function DisplayVideo(props) {

    return (
        <Card image={props.video.image}>
        <h1>{props.heading}</h1>
        <h2>Video title: {props.video.title}</h2>
        <h2>Video length: {props.video.length}</h2>
        </Card>
    );
}

export {DisplayVideo};