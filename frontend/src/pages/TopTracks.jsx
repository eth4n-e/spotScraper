import Navbar from "../components/navbar"
import { useLoaderData } from "react-router-dom"

const TopTracks = () => {
    const user = useLoaderData();

    return (
        <div>
            <Navbar profilePic={user.profilePic}/>
            <p>Top Tracks Page</p>
        </div>
    )
}

export default TopTracks