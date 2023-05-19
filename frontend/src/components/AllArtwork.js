import { useState, useEffect} from "react";
import { ListArtwork } from "./ListArtwork";
import Home from "./Main";

function AllArtwork() {
    const [artworks, setArtworks] = useState([]);
    useEffect(() => {
        callGetAllArtwork();
      }, [])

      const callGetAllArtwork = async () =>{

        const response = await fetch("http://localhost:1339/artworks");
        const result = await response.json();
        setArtworks(result);
    }

    return (

        <div style={{textAlign: "center"}}>
        <h1> Artwork </h1>
        <ListArtwork artworks={artworks} />
        </div>
    )
}


export {AllArtwork};