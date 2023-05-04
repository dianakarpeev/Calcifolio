import { useState } from "react";
import { AddVideoForm } from "./AddVideoForm";
import { DisplayVideo } from "./DisplayVideo";

function AddVideo() {
    const [added, setAdded] = useState({});


    return (
        <>
        <AddVideoForm setAdded = {setAdded} />

        <DisplayVideo video={added} heading="The added video is"/>
        
        
        </>
    );
}
export {AddVideo}