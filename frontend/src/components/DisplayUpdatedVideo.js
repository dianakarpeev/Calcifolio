import Card from './Card.js'
import Video from './VideoT.js'
import { Button } from "@mui/material";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UpdateVideo } from './UpdateVideo.js';
import { useState } from 'react';

function DisplayUpdatedVideo(props) {
    let navigate = useNavigate();
    function HandleReload() {
        navigate('/videos')
    }
    return (
        <div>
        <Card>
        <h1>{props.heading}</h1>
        <h2>{props.video.title}</h2>
        <Video url= {props.video.url}/>
        <Button onClick={HandleReload}>Ok</Button>
        </Card>
        </div>
    );
}

export {DisplayUpdatedVideo};