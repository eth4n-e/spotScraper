import Navbar from '../components/navbar'
import { useLocation } from 'react-router-dom'

const Playlists = () => {
    const location = useLocation();
    const user = location.state?.user;

    return (
        <div>
            <Navbar profilePic={user.profilePic} user={user}/>
            <p>Playlists</p>
        </div>
    )
}

export default Playlists;