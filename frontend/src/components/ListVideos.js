import {DisplayVideo} from './DisplayVideo'
function ListVideos({ videos }) {


    return (
        <div>
        <ul>
            {videos.map((video) => (
            <div>
                <DisplayVideo video = {video}/>
                </div>
                ))}
        </ul>
            

        </div>
    )
}

export {ListVideos}