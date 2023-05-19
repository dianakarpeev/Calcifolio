import {PrettyDisplayVideo} from './PrettyDisplayVideo'
function ListVideosCarousel({ videos }) {

    if (videos.length > 0) {
    return (
        <div>
        <ul style={{display:"flex", flexDirection:"row", flexWrap:"wrap", width: "98%", justifyContent: "space-evenly"}}>
             {videos.map((video) => (
                 <PrettyDisplayVideo video = {video}/>
                 ))}
         </ul>
             
 
         </div>
    )}
     return (
    <></>
            )
}

export {ListVideosCarousel}