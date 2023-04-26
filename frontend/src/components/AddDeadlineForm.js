import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const border3 = {
  margin: "2rem",
  padding: "2rem 2rem",
  textAlign: "center",
};
const label = {
  width: "180px",
  clear: "left",
  textAlign: "center",
  paddingRight: "10px",
};
const button={
  width: "180px",
  clear: "left",
  textAlign: "center",
  paddingRight: "10px",
}
/** Component that lets the user enter in a name and date accessing the PUT endpoint.
 *  Returns JSX containing the form.
 */
function AddDeadlineForm(props) {
  const projectNameRef = useRef(null);
  const projectDueDayRef = useRef(null);

  const navigate = useNavigate();
  /** Handler method that displays the name entered in the form in an alert */
  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent page reload

    const request = {
      method: "POST",
      body: JSON.stringify({
        projectName: projectNameRef.current.value,
        projectDueDay: projectDueDayRef.current.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const response = await fetch("http://localhost:1339/deadlines/", request);
    const result = await response.json();
    if (response.status === 400) {
      navigate("/deadlines", { state: { errorMessage: result.errorMessage } });
    } else if (response.status === 500) {
      navigate("/systemerror", {
        state: { errorMessage: result.errorMessage },
      });
    } else {
      props.setAdded(result);
    }
  };
  return (
    <div >
      <h2>Create a new deadline</h2>
      <form onSubmit={handleSubmit}>
        <div style={border3}>
          <label style={label} htmlFor="name">
            Name
          </label>
          <input
            type="text"
            placeholder="Name..."
            ref={projectNameRef}
            required
          />
          <br />
          <label style={label} htmlFor="name">
            Due date
          </label>
          <input
            type="text"
            placeholder="YYYY-MM-DD..."
            ref={projectDueDayRef}
            required
          />
        </div>
        <button style={button} type="submit">Create</button>
      </form>
    </div>
  );
}
export { AddDeadlineForm };
