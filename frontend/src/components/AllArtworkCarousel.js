import { useState, useEffect} from "react";
import { ListArtworkCarousel } from "./ListArtworkCarousel";

function AllArtworkCarousel() {
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
        <h1> Artworks </h1>
        <ListArtworkCarousel artworks={artworks} />
        </div>
    )
}


export {AllArtworkCarousel};