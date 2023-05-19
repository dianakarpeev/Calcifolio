import { useState } from "react";
import { DisplayUpdatedVideo } from "./DisplayUpdatedVideo";
import { useRef } from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import React from "react";


function UpdateVideoForm(props) {
    const newTitleRef = useRef(null);
    const urlRef = useRef(null);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const title = searchParams.get("title");

    const border3 = {
        margin: "2rem",
        padding: "2rem 2rem",
        textAlign: "center",
      };
      const label = {
        width: "180px",
        clear: "left",
        textAlign: "center",
        paddingRight: "10px",
      };
      const button={
        width: "180px",
        clear: "left",
        textAlign: "center",
        paddingRight: "10px",
      }

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
    props.setAdded(result);
    }
    };

    
    return (
    <>
    <form onSubmit={handleSubmit}>
        <div style={border3}>
            <label style={label} htmlFor="newTitle">New Title</label>
            <input type="text" placeholder="New Title..." ref={newTitleRef} required/>
            <label style={label} htmlFor="newLength">New URL</label>
            <input type="text" placeholder="New url..." ref={urlRef} required/>

            </div>    
            <button className="videoButton" type="submit">Update Video</button>
    </form>


    </>
    );
}
    

export {UpdateVideoForm};