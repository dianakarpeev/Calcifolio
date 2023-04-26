
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const border3 = {
    margin: "1rem",
    padding: "2rem 2rem",
    textAlign: "left",
  };
  const label = {
    width: "180px",
    clear: "left",
    textAlign: "center",
    paddingRight: "10px",
  };
  const button={
    width: "180px",
    clear: "right",
    textAlign: "center",
    paddingRight: "10px",
    marginLeft: "10px",
  }
  

function GetSingleDeadlineForm(props) {
    const projectNameRef = useRef(null);
    const navigate = useNavigate();
  
    const handleSubmit = async (event) => {
      event.preventDefault();

      const response = await fetch(
        "http://localhost:1339/deadlines/" +projectNameRef.current.value, {method: "GET"}
      );
      const result = await response.json();
  
      if (response.status === 400) {
        navigate("/deadlines", { state: { errorMessage: result.errorMessage } });
      } else if (response.status === 500) {
        navigate("/systemerror", {
          state: { errorMessage: result.errorMessage },
        });
      } else {
        props.setDeadline(result);
      }
    };
    return (
        <div>
            <h2> Find deadline</h2>
          <form onSubmit={handleSubmit}>
          <div style={border3}>
          <label style={label} htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Name..."
              ref={projectNameRef}
              required
            />
             <button style={button} type="submit">Find</button>
          </div>
           
          </form>
        </div>
      );
    }

    export { GetSingleDeadlineForm };