import { useState } from "react";
import { AddArtworkForm } from "./AddArtworkForm";
import { DisplayUpdatedArtwork } from "./DisplayUpdatedArtwork";

function AddArtwork() {
    const [added, setAdded] = useState({});

    return (
        <div style={{textAlign: "center", display:"flex", alignContent: "center"}}>
        <AddArtworkForm setAdded = {setAdded} />
        <DisplayUpdatedArtwork artwork={added} heading="Artwork:"/>
        </div>
    );
}
export {AddArtwork}