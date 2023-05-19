import DisplayCard from './DisplayCard.js'
import Video from './VideoT.js'
import { Button } from "@mui/material";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UpdateVideo } from './UpdateVideo.js';
import { useEffect, useState } from 'react';

function PrettyDisplayVideo(props) {
     return (
        <DisplayCard>
        <h1>{props.heading}</h1>
        <h2>{props.video.title}</h2>
        <Video url= {props.video.url}/>
        </DisplayCard>
    );
}

export {PrettyDisplayVideo};