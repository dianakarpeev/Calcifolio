import { Link } from "react-router-dom";

function SystemError({errorMessage}){
    return(
        <div>
            <h1>There was a system error</h1>
            <p>{errorMessage}</p>
            <Link to="/">Go home</Link>
        </div>
    )
}

export default SystemError;

