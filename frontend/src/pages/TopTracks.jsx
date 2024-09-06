import Navbar from "../components/navbar"
import { useLoaderData } from "react-router-dom"

const TopTracks = () => {
    const userRender = useLoaderData();
    const user = userRender.data.user;

    return (
        <div>
            <Navbar profilePic={user.profilePic}/>
            <p>Top Tracks Page</p>
        </div>
    )
}

export default TopTracks