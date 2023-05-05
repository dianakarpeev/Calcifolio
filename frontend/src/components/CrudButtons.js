import React from "react";
import {NavLink} from "react-router-dom";
import NavButton  from "./NavButton";
import "./CrudButtons.css";


function CrudButtons() {
    
    
    return (
    <div className="CRUD_Buttons">
    <NavButton to="/videos" label="Get All Videos" /> 
    <NavButton to="/videos/video" label="Find Video"/>
    <NavButton to="/videos/newVideo" label="Create Video"/>
    <NavButton to="/videos/delete" label="Delete Video"/>
    <NavButton to="/videos/update" label="Update Video"/>

    </div>
    );
}
export {CrudButtons}