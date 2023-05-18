import Card from './Card.js'
import Video from '../components/VideoT'
import { Button } from "@mui/material";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UpdateVideo } from './UpdateVideo.js';
import { useState } from 'react';

function DisplayVideo(props) {
    const [edit, setEdit] = useState(false) //start with false, display video will return different stuff depending on the states
    let navigate = useNavigate();


    if (edit) {
       navigate(`/videos/edit?title=${props.video.title}`);
    }
    else {return (
        <div>
        <Card>
        <h1>{props.heading}</h1>
        <h2>{props.video.title}</h2>
        <Video url= {props.video.url}/>
        <Button onClick={setEdit}>Edit</Button>
        <Button>Delete</Button>
        </Card>
        </div>
    );}
}

export {DisplayVideo};