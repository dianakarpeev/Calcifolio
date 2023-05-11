import { useState } from "react";
import { DisplayVideo } from "./DisplayVideo";
import { useRef } from "react";
import {useNavigate} from "react-router-dom";
import React from "react";


function UpdateVideo(props) {



    const titleRef = useRef(null);
    const newTitleRef = useRef(null);
    const imageRef = useRef(null);
    const lengthRef = useRef(null);
    const navigate = useNavigate();
    const [video, setVideo] = useState({});



    const handleSubmit = async (event) => {
        event.preventDefault();


        const requestOptions = {
            method: "PUT",
            body: JSON.stringify({
                newTitle: newTitleRef.current.value,
                newLength: lengthRef.current.value,
                newImage: imageRef.current.value,

            }),
            headers: {
                "Content-type" : "application/json; charset=UTF-8",
            },
        };

    const response = await fetch(`http://localhost:1339/updateVideo/${titleRef.current.value}`, requestOptions);
    const result = await response.json();
    console.log(result);
    if (response.status === 400) {
        navigate("/usererror", { state: { error: result.error } });
  
    }else if (response.status === 500) {
        navigate("/systemerror", { state: { error: result.error } });
    }
    else {
    props.setAdded(result);
    }
    };

    
    return (
    <>
    <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input type="text" placeholder="Title..." ref={titleRef} required/>
            <label htmlFor="newTitle">New Title</label>
            <input type="text" placeholder="New Title..." ref={newTitleRef} required/>
            <label htmlFor="newLength">New Length</label>
            <input type="text" placeholder="New length..." ref={lengthRef} required/>
            <label htmlFor="newImage">new Image</label>
            <input type="text" placeholder="New image..." ref={imageRef}/>
            <button className="videoButton" type="submit">Update Video</button>
    </form>


    <DisplayVideo video = {video} heading="Updated video is" />
    </>
    );
}
    

export {UpdateVideo};