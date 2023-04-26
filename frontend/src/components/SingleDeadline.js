import { useState,useEffect } from "react";
import { DisplayDeadline } from "./DisplayDeadlines";
import { GetSingleDeadlineForm } from "./SingleDeadlineForm";
/**
 * Get single deadline from database and display deadline
 * @param {objec} param0 
 * @returns JSX form
 */
function SingleDeadline({ setDisplay }) {
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    if (deadline) {
      // Only update display when a deadline has been found
      setDisplay(<DisplayDeadline deadline={deadline} heading="The found deadline is" />);
      
    }
  }, [deadline, setDisplay]);
  return (
    <>
      <GetSingleDeadlineForm setDeadline={setDeadline} />
    
    </>
  );
}
export { SingleDeadline };
