import DisplayCard from './DisplayCard.js'


function PrettyDisplayArtwork(props) {
    return (
        <DisplayCard>
        <h1>{props.heading}</h1>
        <h2>{props.artwork.name}</h2>
        <img width='100%' src={props.artwork.url}></img>
        </DisplayCard>
    );
}

export {PrettyDisplayArtwork};