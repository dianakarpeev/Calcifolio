import { PrettyDisplayArtwork } from "./PrettyDisplayArtwork";

/**
 * Lists the artwork form json objects and displays them
 * @param {artworks} collection of all artwork 
 * @returns 
 */
function ListArtworkCarousel({ artworks }) {
  return (
    <div>
      <ul style={{display:"flex", flexDirection:"row", flexWrap:"wrap", width:"100%",justifyContent: "space-evenly"}}>
        {artworks.map((artwork) => (
          <div key={artwork._id}>
            <PrettyDisplayArtwork artwork={artwork} />
          </div>
        ))}
      </ul>
    </div>
  );
}

export { ListArtworkCarousel };
