import { useState } from "react";
import { DisplayUpdatedVideo } from "./DisplayUpdatedVideo";
import { useRef } from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import React from "react";
import { UpdateVideoForm } from "./UpdateVideoForm";


function UpdateVideo(props) {

    const [added, setAdded] = useState({});
    return (
    
     <div style={{textAlign: "center", display:"flex", alignContent: "center"}}>
    <UpdateVideoForm setAdded = {setAdded}></UpdateVideoForm>
    <DisplayUpdatedVideo video = {added} heading="Updated video is" />
    </div>
    );
}
    

export {UpdateVideo};