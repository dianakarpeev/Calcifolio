import Card from "components/Card.js";

/**
 * Displays the deadline in cards
 * @param {object} props of passed JsonObject
 * @returns 
 */
function DisplayDeadline(props){

  return(
    <div>
      <Card>
      <p>{props.heading}</p>
    <p>Project Name: {props.deadline.projectName}</p>
    <p>Date: {props.deadline.projectDueDay}</p>
      </Card>
  </div>
  )
}

export {DisplayDeadline};