
import { useState,useEffect } from "react";
import { DeleteSingleDeadlineForm } from "./DeleteSingleDeadlineForm";

/**
 * Delete a single deadline //missing way to display the success message
 */
function DeleteSingleDeadline({ setDisplay }) {
  const [deadline, setDeadline] = useState(null);

  return (
    <>
      <DeleteSingleDeadlineForm setDeadline={setDeadline} />
    <p>If there is no error message, deletion was successful</p>
    </>
  );
}
export { DeleteSingleDeadline };
