import Card from './Card.js'
import Video from '../components/VideoT'
import { Button } from "@mui/material";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UpdateVideo } from './UpdateVideo.js';
import { useEffect, useState } from 'react';

function DisplayVideo(props) {
    const [edit, setEdit] = useState(false); //start with false, display video will return different stuff depending on the states
    const [Delete, setDelete] = useState(false);
    const [confirm, setConfirm] = useState(false);
    
    let navigate = useNavigate();
    const [video, setVideo] = useState({});



    const handleDelete = async (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "DELETE",
        }
       
            
        
        const response = await fetch(`http://localhost:1339/deleteVideo/${props.video.title}`, requestOptions);
        const result = await response.json();
        console.log(result);
        if (response.status === 400) {
            navigate("/usererror", { state: { error: result.error } });
      
        }else if (response.status === 500) {
            navigate("/systemerror", { state: { error: result.error } });
        }
        else {
        setDelete(true);
        }
        }
    

    if (edit) {
       navigate(`/videos/edit?title=${props.video.title}`);
    }
    else if (Delete) {
        //return nothing
    }
    else {return (
        <div>
        <Card>
        <h1>{props.heading}</h1>
        <h2>{props.video.title}</h2>
        <Video url= {props.video.url}/>
        <Button onClick={setEdit}>Edit</Button>
        <Button onClick={setConfirm}>Delete</Button>
        {confirm && <div>
        <h3>Are you sure?</h3>
            <Button onClick={handleDelete}>Yes</Button>
            <Button onClick={()=>setConfirm(!confirm)}>No</Button>
            </div>}
        </Card>
        </div>
    );}
}

export {DisplayVideo};