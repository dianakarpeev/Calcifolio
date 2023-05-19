import { useState } from "react";
import { useRef } from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import React from "react";
import { UpdateArtworkForm } from "./UpdateArtworkForm";
import { DisplayUpdatedArtwork } from "./DisplayUpdatedArtwork";



function UpdateArtwork(props) {

    const [added, setAdded] = useState({});
    return (
    
     <div style={{textAlign: "center", display:"flex", alignContent: "center"}}>
    <UpdateArtworkForm setAdded = {setAdded}></UpdateArtworkForm>
    <DisplayUpdatedArtwork artwork = {added} heading="Updated artwork is" />
    </div>
    );
}
    

export {UpdateArtwork};