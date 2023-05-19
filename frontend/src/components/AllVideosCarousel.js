import { useState, useEffect} from "react";
import { ListVideosCarousel } from "./ListVideosCarousel";

function AllVideosCarousel() {
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
        <div>
            <h1>All videos</h1>
        <ListVideosCarousel videos={videos}/>
        </div>
    )
}


export {AllVideosCarousel};