import {useRef} from 'react'
import { useNavigate } from "react-router-dom";

function SignupForm() {
    const username = useRef(null);
    const pwd = useRef(null);
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();

        //get the usernames from the database
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({
                username: username.current.value,
                password: pwd.current.value,
            }),
            headers: {
                "Content-type" : "application/json; charset=UTF-8",
            },
        };
     
        const response = await fetch("http://localhost:1339/signup/", requestOptions);

        const result = await response.json();
        if (response.status === 400) {
          navigate("/deadlines", { state: { errorMessage: result.errorMessage } });
        } else if (response.status === 500) {
          navigate("/systemerror", {
            state: { errorMessage: result.errorMessage },
          });
        }
        navigate("/success");
    }
    return (
    <form onSubmit={handleSubmit}>
        <div>
      <h1>Username:</h1>
      <input
         placeholder="Name"
         ref={username} 
         required
      />
      <h1>Password:</h1>
      <input
         type="password"
         placeholder="Password"
         ref={pwd} required
         />
         </div>
         <br></br>
    <button type="submit">Create account</button>
    </form>

    )
}
export {SignupForm}