import ErrorBoundary from "components/ErrorBoundary";
import Main from "components/Main";
import Alert from 'react-bootstrap/Alert';
import { useLocation } from "react-router-dom";

function Deadlines() {
  const {state}= useLocation();

  return (
    <>
    <ErrorBoundary>
    {state && state.errorMessage && <Alert variant="danger" dismissible>{state.errorMessage}</Alert>}
    <Main/>
    </ErrorBoundary>
    
    </>
  );
}

export default Deadlines;