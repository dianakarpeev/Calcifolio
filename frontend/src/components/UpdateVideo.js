import { useState } from "react";
import { DisplayUpdatedVideo } from "./DisplayUpdatedVideo";
import { useRef } from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import React from "react";


function UpdateVideo(props) {
    const newTitleRef = useRef(null);
    const urlRef = useRef(null);
    const navigate = useNavigate();
    const [video, setVideo] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const title = searchParams.get("title");



    const handleSubmit = async (event) => {
        event.preventDefault();


        const requestOptions = {
            method: "PUT",
            body: JSON.stringify({
                newTitle: newTitleRef.current.value,
                newUrl: urlRef.current.value,

            }),
            headers: {
                "Content-type" : "application/json; charset=UTF-8",
            },
        };

    const response = await fetch(`http://localhost:1339/updateVideo/${title}`, requestOptions);
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
    };

    
    return (
    <>
    <form onSubmit={handleSubmit}>
            <label htmlFor="newTitle">New Title</label>
            <input type="text" placeholder="New Title..." ref={newTitleRef} required/>
            <label htmlFor="newLength">New URL</label>
            <input type="text" placeholder="New url..." ref={urlRef} required/>
            <button className="videoButton" type="submit">Update Video</button>
    </form>


    <DisplayUpdatedVideo video = {video} heading="Updated video is" />
    </>
    );
}
    

export {UpdateVideo};