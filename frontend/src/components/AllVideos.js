import { useState, useEffect} from "react";
import { ListVideos } from "./ListVideos";
import Home from "./Main";

function AllVideos() {
    const [videos, setVideos] = useState([]);
    useEffect(() => {
        callGetAllVideos();
      }, [])

      const callGetAllVideos = async () =>{

        const response = await fetch("http://localhost:1339/videos");
        const result = await response.json();
        setVideos(result);
    }

    return (

        <>
        <h1> All Videos </h1>
        <ListVideos videos={videos} />
        </>
    )
}


export {AllVideos};