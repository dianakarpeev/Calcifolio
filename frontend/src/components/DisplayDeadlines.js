import Card from "components/Card.js";
import React,{useState, useEffect} from "react";
/**
 * Displays the deadline in cards
 * @param {object} props of passed JsonObject
 * @returns 
 */
function DisplayDeadline(props){
  const[show,toggleShow]= useState(false);

  return(
      <Card>
      <h1>{props.heading}</h1>
      <p>Project Name:</p>
      <p>{props.deadline.projectName}</p>
      <br></br>
      <p>Date:</p>
      <p>{props.deadline.projectDueDay}</p>
      <button onClick={()=>toggleShow(!show)}> {show ? "hide":"more"}</button>
      {show && <p>{props.deadline.description}</p>}
      </Card>
  )
}

export {DisplayDeadline};