import Card from './Card.js'
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DisplayArtwork(props) {
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
       
            
        
        const response = await fetch(`http://localhost:1339/artworks/delete/${props.artwork.name}`, requestOptions);
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
        navigate(`/artworks/update?name=${props.artwork.name}`);
    }
    else if (Delete) {
        //return nothing
    }
    else {

    return (
        <Card>
        <h1>{props.heading}</h1>
        <h2>{props.artwork.name}</h2>
        <img width='100%' src={props.artwork.url}></img>
        <Button onClick={setEdit}>Edit</Button>
        <Button onClick={setConfirm}>Delete</Button>
        {confirm && <div>
        <h3>Are you sure?</h3>
            <Button onClick={handleDelete}>Yes</Button>
            <Button onClick={()=>setConfirm(!confirm)}>No</Button>
            </div>}
        </Card>
    );
}}

export {DisplayArtwork};