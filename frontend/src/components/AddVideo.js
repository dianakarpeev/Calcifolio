import { useState } from "react";
import { AddVideoForm } from "./AddVideoForm";
import { DisplayVideo } from "./DisplayVideo";

function AddVideo() {
    const [added, setAdded] = useState({});

    return (
        <div style={{textAlign: "center", display:"flex", alignContent: "center"}}>
        <AddVideoForm setAdded = {setAdded} />

        <DisplayVideo video={added} heading="Video:"/>
        
        
        </div>
    );
}
export {AddVideo}