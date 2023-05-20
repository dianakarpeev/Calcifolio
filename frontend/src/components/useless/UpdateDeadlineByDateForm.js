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

function UpdateDeadlineByDateForm(props) {
  const projectNameRef = useRef(null);
  const projectNewDateRef = useRef(null);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const request = {
      method: "PUT",
      body: JSON.stringify({
        projectName: projectNameRef.current.value,
        newDate: projectNewDateRef.current.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const response = await fetch(
      "http://localhost:1339/deadlines/" +
        projectNameRef.current.value +
        "/" +
        projectNewDateRef.current.value +
        "/by-date",
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
    <div>
      <h2>Update by date</h2>
      <form onSubmit={handleSubmit}>
        <div style={border3}>
        <label style={label} htmlFor="name">Name</label>
        <input
          type="text"
          placeholder="Name..."
          ref={projectNameRef}
          required
        />
        <br />
        <label style={label} htmlFor="name">New Date</label>
        <input
          type="text"
          placeholder="New YYYY-MM-DD..."
          ref={projectNewDateRef}
          required
        />
       </div>
        <button style={button}type="submit">Update</button>
      </form>
    </div>
  );
}

export { UpdateDeadlineByDateForm };
