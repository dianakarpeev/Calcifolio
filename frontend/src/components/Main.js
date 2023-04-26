import { useState } from "react";

import TwoPanes from "./TwoPanes";
import Menu from "./Menu";

/** Main component for our home page. Maintains state for the two display panes. */
function Main() {
  const defaultRightPane = <p></p>;
  const [rightPane, setRightPane] = useState(defaultRightPane);

  const defaultLeftPane = <Menu setDisplay={setRightPane} />;
  const [leftPane] = useState(defaultLeftPane);

  return (
    <div>
      <TwoPanes leftPane={leftPane} rightPane={rightPane} />{" "}
    </div>
  );
}
export default Main;
