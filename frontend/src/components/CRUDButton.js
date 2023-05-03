import React from "react";
import { useMatch } from "react-router";
import { useResolvedPath } from "react-router";
import { NavLink } from "react-router-dom";
function NavButton(props) {

    let resolved = useResolvedPath(props.to);
    let match = useMatch({ path: resolved.pathname, end: true });
    const buttonStyle = {
        backgroundColor: "azure",
        border: "none",
        color: "black",
        padding: "10px 30px",
        textAlign: "center",
        textDecoration: "none",
        width: "auto",
        fontSize: "16px",
      };
      const actveButtonStyle = {
        backgroundColor: "gray",
        border: "none",
        color: "white",
        padding: "10px 30px",
        textAlign: "center",
        textDecoration: "none",
        fontSize: "16px",


      };

    return (
        <NavLink to={props.to}>
            <button style={match ? actveButtonStyle : buttonStyle}>
                <p>{props.label}</p>
            </button>
        </NavLink>
    )
}  

export {NavButton}