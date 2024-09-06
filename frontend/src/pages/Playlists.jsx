import Navbar from '../components/navbar'
import { useLoaderData } from 'react-router-dom'

const Playlists = () => {
    const userRender = useLoaderData();
    const user = userRender.data.user;

    return (
        <div>
            <Navbar profilePic={user.profilePic}/>
            <p>Playlists</p>
        </div>
    )
}

export default Playlists;