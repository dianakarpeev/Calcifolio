import { SingleDeadline } from './SingleDeadline';
import { AllDeadlines } from "./AllDeadlines";
import { AddDeadline } from "./AddDeadline";
import { UpdateDeadlineByName } from "./UpdateDeadlineByName";
import { UpdateDeadlineByDate } from "./UpdateDeadlineByDate";
import Button from "@mui/material/Button";
import { DeleteSingleDeadline } from './DeleteSingleDeadline';
/**
 * Creates a navigation menu for the specified component in order to keep the page more organized
 */
function Menu({ setDisplay }) {
  const menuItem1 = <SingleDeadline setDisplay={setDisplay} />;
  const menuItem2 = <AllDeadlines setDisplay={setDisplay} />;
  const menuItem3 = <AddDeadline setDisplay={setDisplay} />;
  const menuItem4 = <UpdateDeadlineByName setDisplay={setDisplay} />;
  const menuItem5 = <UpdateDeadlineByDate setDisplay={setDisplay} />;
  const menuItem6 = <DeleteSingleDeadline setDisplay={setDisplay} />;

  return (
    <div style={{minWidth:"90vw"}}>
      <AllDeadlines setDisplay={setDisplay}/>
      <p />
    </div>
  );
}

export default Menu;
