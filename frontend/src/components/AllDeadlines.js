import { ListDeadlines } from "./ListDeadlines";
import React,{useState, useEffect} from "react";
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
function AllDeadlines(){
  const [deadlines, setDeadline] = useState([]);
  useEffect(() => {
    callGetAllDeadlines();
  })
  const callGetAllDeadlines = async()=>{ const response = await fetch("http://localhost:1339/deadlines", {
    method: "GET",
  });
  const result =await  response.json();
  setDeadline(result)
}
 

  return (
    <div>
      <h2>Current Deadlines</h2>
      <ListDeadlines deadlines={deadlines}/>
    </div>
  );
}
export {AllDeadlines};