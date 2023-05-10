import Card from "components/Card.js";

/**
 * Displays the deadline in cards
 * @param {object} props of passed JsonObject
 * @returns 
 */
function DisplayDeadline(props){

  return(
      <Card>
      <h1>{props.heading}</h1>
      <p>Project Name:</p>
      <p>{props.deadline.projectName}</p>
      <br></br>
      <p>Date:</p>
      <p>{props.deadline.projectDueDay}</p>
      </Card>
  )
}

export {DisplayDeadline};