import { useState } from "react";
import { AddArtworkForm } from "./AddArtworkForm";
import { DisplayArtwork } from "./DisplayArtwork";

function AddArtwork() {
    const [added, setAdded] = useState({});

    return (
        <div style={{textAlign: "center", display:"flex", alignContent: "center"}}>
        <AddArtworkForm setAdded = {setAdded} />
        <DisplayArtwork artwork={added} heading="Artwork:"/>
        </div>
    );
}
export {AddArtwork}