import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import axios from 'axios';

const Playlists = () => {
    const user = useLoaderData();
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        const fetchPlaylists = async (user) => {
            // maybe add other properties like
                // limit (number of tracks to fetch)
                // next (url to the next page of results)
                // this would be once I implemented a paginated version
            const fetchedPlaylists = await axios.post('/api/music/fetchPlaylists', {
                user
            });

            console.log(fetchedPlaylists);

        }

        fetchPlaylists(user);
    }, [user])

    return (
        <div>
            <Navbar profilePic={user.profilePic}/>
            <p>Playlists</p>
        </div>
    )
}

export default Playlists;