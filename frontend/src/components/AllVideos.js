import { useState } from "react";
import { ListVideos } from "./ListVideos";
import Home from "./Main";

function AllVideos() {
    const [videos, setVideos] = useState([]);

    return (

        <>
        <button className="videoButton" onClick= {() => callGetAllVideos(setVideos)}>Get All Videos</button>
        <ListVideos videos={videos} />
        
        </>
    )
}
async function callGetAllVideos(setVideos){

    const response = await fetch("http://localhost:1339/videos");
    const result = await response.json();
    setVideos(result);
}

export {AllVideos};