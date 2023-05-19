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
function UpdateDeadlineByNameForm(props) {
  const projectNameRef = useRef(null);
  const projectNewNameRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const request = {
      method: "PUT",
      body: JSON.stringify({
        projectName: projectNameRef.current.value,
        newName: projectNewNameRef.current.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const response = await fetch(
      "http://localhost:1339/deadlines/" +
        projectNameRef.current.value +
        "/" +
        projectNewNameRef.current.value,
      request
    );
    const result = await response.json();

    if (response.status === 400) {
      navigate("/deadlines", { state: { errorMessage: result.errorMessage } });
    } else if (response.status === 500) {
      navigate("/systemerror", {
        state: { errorMessage: result.errorMessage },
      });
    } else {
      props.setUpdated(result);
    }
  };

  return (
    <div >
      <h2>Update by name</h2>
      <form onSubmit={handleSubmit}>
        <div style={border3}>
        <br />
        <label style={label} htmlFor="name">
          New Name
        </label>
        <input
          type="text"
          placeholder="New Name..."
          ref={projectNewNameRef}
          required
        />
        </div>
        <button style={button} type="submit">Update</button>
      </form>
    </div>
  );
}

export { UpdateDeadlineByNameForm };
