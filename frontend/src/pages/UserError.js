import { Link,useLocation } from "react-router-dom";

function UserError(){
    const { state } = useLocation();

    return(
        <div>
            <h1>There was an input error</h1>
            <p>{state.errorMessage};</p>
            <Link to="/">Go home</Link>
        </div>
    );
}

export default UserError;