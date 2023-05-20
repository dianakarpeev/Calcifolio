
import { AllDeadlines } from "./AllDeadlines";
/**
 * Creates a navigation menu for the specified component in order to keep the page more organized
 */
function Menu({ setDisplay }) {

  return (
    <div style={{minWidth:"90vw"}}>
      <AllDeadlines/>
      <p />
    </div>
  );
}

export default Menu;
