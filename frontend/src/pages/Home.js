
import { useSearchParams, useLocation } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import ErrorBoundary from "components/ErrorBoundary";

function Home(){
    const [searchParams, setSearchParams ] = useSearchParams();
    const {state}= useLocation();

    return(
        <>
        <ErrorBoundary>
        {state && state.errorMessage && <Alert variant="danger">{state.errorMessage}</Alert>}
        <h1>Welcome to Calcifolio {searchParams.get('name')}!</h1>
        </ErrorBoundary>
       
        </>
    );
}

export default Home;