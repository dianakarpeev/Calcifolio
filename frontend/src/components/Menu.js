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
    <div className="d-flex justify-content-center flex-column">
           <Button variant="contained" color="primary" onClick={() => setDisplay(menuItem2)}>
        Show All Deadlines
      </Button>
      <p />
      <Button variant="contained" color="primary" onClick={() => setDisplay(menuItem1)}>
        Get Single Deadline
      </Button>
      <p />
      <Button variant="contained" color="primary"onClick={() => setDisplay(menuItem3)}>
        Create Deadline
      </Button>
      <p />
      <Button variant="contained" color="primary" onClick={() => setDisplay(menuItem4)}>
        Update Deadline By Name
      </Button>
      <p />
      <Button variant="contained" color="primary"onClick={() => setDisplay(menuItem5)}>
        Update Deadline By Date
      </Button>
      <p />
      <Button variant="contained" color="primary" onClick={() => setDisplay(menuItem6)}>
        Delete Deadline
      </Button>
    </div>
  );
}

export default Menu;
