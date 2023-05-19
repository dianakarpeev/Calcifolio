import { DisplayArtwork } from "./DisplayArtwork";

/**
 * Lists the artwork form json objects and displays them
 * @param {artworks} collection of all artwork 
 * @returns 
 */
function ListArtwork({ artworks }) {
  return (
    <div>
      <ul style={{display:"flex", flexDirection:"row", flexWrap:"wrap", width:"90vw"}}>
        {artworks.map((artwork) => (
          <div key={artwork._id}>
            <DisplayArtwork artwork={artwork} />
          </div>
        ))}
      </ul>
    </div>
  );
}

export { ListArtwork };
