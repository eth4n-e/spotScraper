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
            const playlistResponse = await axios.post('/api/music/fetchPlaylists', {
                user
            });

            // extract the actual playlists
            const playlistObjects = playlistResponse.data.playlists.items;

            // only want to consider playlists created / owned by the user
            // filter all the playlists returned by ones whose owner id matches the user id
            const userOwnedPlaylists = playlistObjects.filter( (playlist) => playlist.owner.id === user._id)

            setPlaylists(userOwnedPlaylists);
        }
        fetchPlaylists(user);
    }, [user])

    return (
        <div>
            <Navbar profilePic={user.profilePic}/>
            <div className='mt-4 mx-4 grid grid-cols-4 gap-6'>
                {
                    playlists && (playlists.map( (playlist) => (
                    <div className="rounded-md p-2 bg-beige2 shadow-2xl" key={playlist.id}>
                        <img className="object-cover rounded-md drop-shadow-xl " src={playlist.images[0].url} alt="Playlist cover"/>
                        <p className="mt-2 text-brown3 font-semibold">{playlist.name}: {playlist.tracks.total} tracks</p>
                    </div>  
                    )))
                }
            </div>
        </div>
    )
}

export default Playlists;