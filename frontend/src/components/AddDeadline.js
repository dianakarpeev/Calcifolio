import { useState, useEffect } from "react";
import { AddDeadlineForm } from "./AddDeadlineForm";
import { DisplayDeadline } from "./DisplayDeadlines";
/** Component that lets the user add a deadline and then displays it.*/
function AddDeadline({ setDisplay }) {
  const [added, setAdded] = useState(null); // null by default so
  // truthy check fails
  useEffect(() => {
    if (added) {
      // Only update display when a deadline has been added
        setDisplay(<DisplayDeadline deadline={added} />);
     
    }
  }, [added, setDisplay]);
  return (
    <>
      <AddDeadlineForm setAdded={setAdded} />
    
    </>
  );
}
export { AddDeadline};