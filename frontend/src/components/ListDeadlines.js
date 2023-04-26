import { DisplayDeadline } from "./DisplayDeadlines";

/**
 * Lists the deadline form json objects and displays them
 * @param {object} param0 
 * @returns 
 */
function ListDeadlines({ deadlines }) {
  return (
    <div>
      <ul>
        {deadlines.map((deadline) => (
          <div key={deadline._id}>
            <DisplayDeadline deadline={deadline} />
          </div>
        ))}
      </ul>
    </div>
  );
}

export { ListDeadlines };
