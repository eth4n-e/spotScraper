import NavBar from '../components/NavBar';
import PlaylistCard from '../components/PlaylistCard';
import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import axios from 'axios';

const Playlists = () => {
    const user = useLoaderData();
    const [playlists, setPlaylists] = useState([]);
    const [counter, setCounter] = useState(0);
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

    const handleCardClick = (id) => {
        // have to update list in a state setter for React to handle properly
        setClickedPlaylists(prevList => {
            let updatedPlaylistArr = [];

            if (prevList.indexOf(id) === -1) { // track not present in list
                updatedPlaylistArr = [...prevList, id];
            } else {
                // create new array without element that was clicked
                updatedPlaylistArr = prevList.filter(trackId => trackId !== id);
            }
            setCounter(updatedPlaylistArr.length);

            // updated list becomes the new state upon return
            return updatedPlaylistArr;
        });
    }

    return (
        <div className="w-100 bg-beige">
            <NavBar profilePic={user.profilePic} buttonType={"Add"} counter={counter}/>
            <div className='mt-4 pb-4 mx-4 grid grid-cols-4 gap-6'>
                {
                    playlists && (playlists.map( (playlist) => (
                        <PlaylistCard playlist={playlist} handleCardClick={handleCardClick} isClicked={clickedPlaylists.includes(playlist.id)}/>
                    )))
                }
            </div>
        </div>
    )
}

export default Playlists;