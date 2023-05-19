import { useState } from "react";
import { AddVideoForm } from "./AddVideoForm";
import { DisplayUpdatedVideo } from "./DisplayUpdatedVideo";

function AddVideo() {
    const [added, setAdded] = useState({});

    return (
        <div style={{textAlign: "center", display:"flex", alignContent: "center"}}>
        <AddVideoForm setAdded = {setAdded} />

        <DisplayUpdatedVideo video={added} heading="Video:"/>
        
        
        </div>
    );
}
export {AddVideo}