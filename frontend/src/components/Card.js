import { Button } from "@mui/material";
import  Menu from "./Menu.js"
import "./Card.css"
/**
 * Manages data and state presentation
 * @param {object} props children
 * @returns 
 */
function Card({ children}) {
    return (    
       <div className="card">   
          {children}
          <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
           <Button>Edit</Button>
           <Button>Delete</Button>
           </div>
       </div>  
    );
  }
  
  export default Card;