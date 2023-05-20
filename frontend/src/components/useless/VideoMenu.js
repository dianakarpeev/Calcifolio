import React from "react";
import {NavLink} from "react-router-dom";
import NavButton  from "./NavButton";
import "./CrudButtons.css";
import {AllVideos} from "../AllVideos"


function VideoMenu() {
    
    
    return (
        <div style={{minWidth:"90vw"}}>
        <AllVideos/>
        <p />

    </div>
    );
}
export {VideoMenu}