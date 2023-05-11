import { useState } from "react";
import { DisplayVideo } from "./DisplayVideo";
import { useRef } from "react";
import {useNavigate} from "react-router-dom";
import React from "react";
import './form.css'


function DeleteVideo(props) {



    const titleRef = useRef(null);
    const navigate = useNavigate();
    const [video, setVideo] = useState({});



    const handleSubmit = async (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "DELETE",
        }
       
            
        
        const response = await fetch(`http://localhost:1339/deleteVideo/${titleRef.current.value}`, requestOptions);
        const result = await response.json();
        console.log(result);
        if (response.status === 400) {
            navigate("/usererror", { state: { error: result.error } });
      
        }else if (response.status === 500) {
            navigate("/systemerror", { state: { error: result.error } });
        }
        else {
        setVideo(result);
        }
        }
    

    
    return (
    <>
    <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input type="text" placeholder="Title..." ref={titleRef} required/>
            <button className="videoButton" type="submit">Delete Video</button>
    </form>


    <DisplayVideo video = {video} heading="Deleted video is" />
    </>
    );
}
    

export {DeleteVideo};