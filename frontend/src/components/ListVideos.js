import {DisplayVideo} from './DisplayVideo'
function ListVideos({ videos }) {

    if (videos.length > 0) {
    return (
        <div>
       <ul style={{display:"flex", flexDirection:"row", flexWrap:"wrap", width:"90vw"}}>
            {videos.map((video) => (
            <div>
                <DisplayVideo video = {video}/>
            </div>
                ))}
        </ul>
            

        </div>
    )
            }
            return (
                <></>
            )
}

export {ListVideos}