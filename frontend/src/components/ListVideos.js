function ListVideos({ videos }) {


    return (
        <div>
            <h1> All Videos </h1>
        <ul>
            {videos.map((video) => (
            <li key={video._id}>
                {video.title} with length {video.length}
                </li>
                ))}
        </ul>
            

        </div>
    )
}

export {ListVideos}