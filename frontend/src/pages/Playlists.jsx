import NavBar from '../components/NavBar';
import PlaylistCard from '../components/PlaylistCard';
import ClickedPlaylistCard from '../components/ClickedPlaylistCard.jsx';
import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import axios from 'axios';
import { createHandleCardClick } from '../utils/helpers.js';

const Playlists = () => {
    const user = useLoaderData();
    const [playlists, setPlaylists] = useState([]);
    const [clickedPlaylists, setClickedPlaylists] = useState([]);

    useEffect(() => {
        const fetchPlaylists = async (user) => {
    
            const playlistResponse = await axios.post('/api/music/fetchPlaylists', {
                user
            });
            const playlistObjects = playlistResponse.data.playlists.items;

            // only want to consider playlists created / owned by the user
            const userOwnedPlaylists = playlistObjects.filter( (playlist) => playlist.owner.id === user._id)

            setPlaylists(userOwnedPlaylists);
        }
        fetchPlaylists(user);
    }, [user])

    const handleCardClick = createHandleCardClick(setClickedPlaylists);

    return (
        <div className="w-100 bg-beige">
            <NavBar user={user} itemIds={clickedPlaylists} setClickedCards={setClickedPlaylists}/>
            <div className='mt-4 pb-4 mx-4 grid grid-cols-4 gap-6'>
                {
                    playlists && (playlists.map( (playlist) => (
                        clickedPlaylists.includes(playlist.id) ? (
                            <ClickedPlaylistCard playlist={playlist} handleCardClick={handleCardClick} key={playlist.id}/>
                        ) : (
                            <PlaylistCard playlist={playlist} handleCardClick={handleCardClick} key={playlist.id}/>
                        )
                    )))
                }
            </div>
        </div>
    )
}

export default Playlists;