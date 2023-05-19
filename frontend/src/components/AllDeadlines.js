import { ListDeadlines } from "./ListDeadlines";
import React,{useState, useEffect} from "react";
import { Button } from "@mui/material";
import { AddDeadline } from "./AddDeadline";
//Styling
const button={
  width: "180px",
  clear: "left",
  textAlign: "center",
  paddingRight: "10px",
}

/**
 * Component that displays a list of deadlines
 */
function AllDeadlines({setDisplay}){
  const deadlineAdd = <AddDeadline/>;
  const [deadlines, setDeadline] = useState([]);
  useEffect(() => {
    callGetAllDeadlines();
  }, [])
  const callGetAllDeadlines = async()=>{ const response = await fetch("http://localhost:1339/deadlines", {
    method: "GET",
  });
  const result =await  response.json();
  setDeadline(result)
}
 

  return (
    <div>
      <h2 style={{color: "orange"}}> Deadlines</h2>
      <ListDeadlines deadlines={deadlines}/>
    </div>
  );
}
export {AllDeadlines};