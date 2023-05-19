import Card from './Card.js'
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function DisplayUpdatedArtwork(props) {
    let navigate = useNavigate();
    function HandleReload() {
        navigate('/artworks')
    }
    return (
        <div>
        <Card>
        <h1>{props.heading}</h1>
        <h2>{props.artwork.name}</h2>
        <img width='100%' src={props.artwork.url}></img>
        <Button onClick={HandleReload}>Ok</Button>
        </Card>
        </div>
    );
}

export {DisplayUpdatedArtwork};