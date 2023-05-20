import { useState, useEffect } from "react";
import {UpdateDeadlineByDateForm} from "./UpdateDeadlineByDateForm";
import { DisplayDeadline } from "../DisplayDeadlines";


/**
 * Component that lets the user update a deadline by date and then displays it
 * @param {*} param0 
 * @returns a form and displayDeadlines
 */
function UpdateDeadlineByDate({setDisplay}){
    const[updated, setUpdated] =useState(null);
    useEffect(() => {
        if (updated) {
          // Only update display when a deadline has been updated
          setDisplay(<DisplayDeadline deadline={updated} heading="The updated deadline is" />);
          
        }
      }, [updated, setDisplay]);
      return (
        <>
          <UpdateDeadlineByDateForm setUpdated={setUpdated} />
        
        </>
      );
}

export {UpdateDeadlineByDate};