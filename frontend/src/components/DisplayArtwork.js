import Card from './Card.js'

function DisplayArtwork(props) {

    return (
        <Card>
        <h1>{props.heading}</h1>
        <h2>{props.artwork.name}</h2>
        <img width='100%' src={props.artwork.url}></img>
        </Card>
    );
}

export {DisplayArtwork};