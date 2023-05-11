import { CrudButtons } from "components/CrudButtons";
import ErrorBoundary from "components/ErrorBoundary";
import Alert from 'react-bootstrap/Alert';
import { useLocation } from "react-router-dom";

function Videos() {

    const {state}= useLocation();
  
    return (
      <>
      <ErrorBoundary>
      {state && state.errorMessage && <Alert variant="danger" dismissible>{state.errorMessage}</Alert>}
      <CrudButtons/>
      </ErrorBoundary>
      
      </>
    );
  }
    
  export default Videos;