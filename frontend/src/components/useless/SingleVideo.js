import { useState } from "react";
import { DisplayVideo } from "../DisplayVideo";
import { useRef } from "react";
import {useNavigate} from "react-router-dom";
import React from "react";


function SingleVideo(props) {



    const titleRef = useRef(null);
    const navigate = useNavigate();
    const [video, setVideo] = useState({});



    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const response = await fetch(`http://localhost:1339/videos/${titleRef.current.value}`);
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
            <button type="submit">Search Video</button>
    </form>


    <DisplayVideo video = {video} heading="Video found is" />
    </>
    );
}
    

export {SingleVideo};