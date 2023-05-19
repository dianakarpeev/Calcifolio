import Card from "components/Card.js";
import React,{useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";
/**
 * Displays the deadline in cards
 * @param {object} props of passed JsonObject
 * @returns 
 */
function DisplayDeadline(props){
  const[show,toggleShow]= useState(false);
  const [edit, setEdit] = useState(false); //start with false, display video will return different stuff depending on the states
  const [Delete, setDelete] = useState(false);
  const [confirm, setConfirm] = useState(false);
  let navigate = useNavigate();

  const handleDelete = async (event) => {
    event.preventDefault();

    const response = await fetch(
      "http://localhost:1339/deadlines/" + props.deadline.projectName, {method: "DELETE"}
    );
    const result = await response.json();

    if (response.status === 400) {
      navigate("/deadlines", { state: { errorMessage: result.errorMessage } });
    } else if (response.status === 500) {
      navigate("/systemerror", {
        state: { errorMessage: result.errorMessage },
      });
    } else {
      setDelete(true);
    }
  };


 if (Delete) {
     //return nothing
 }

else {return(
      <Card>
      <h1>{props.heading}</h1>
      <p>Project Name:</p>
      <p>{props.deadline.projectName}</p>
      <p>Date: {props.deadline.projectDueDay}</p>
      <button onClick={()=>toggleShow(!show)}> {show ? "hide":"more"}</button>
      {show && <div>
      <p>{props.deadline.description}</p>
      
        <Button onClick={setConfirm}>Delete</Button>
        {confirm && <div>
        <h3>Are you sure?</h3>
            <Button onClick={handleDelete}>Yes</Button>
            <Button onClick={()=>setConfirm(!confirm)}>No</Button>
            </div>}
      
      </div>
      }
      </Card>
  )
}
}

export {DisplayDeadline};