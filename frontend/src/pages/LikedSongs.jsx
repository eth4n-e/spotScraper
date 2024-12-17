import { useEffect, useState } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import NavBar from '../components/NavBar';
import TrackCard from '../components/TrackCard';
import axios from 'axios';
import { createHandleCardClick } from '../utils/helpers';
import { create } from 'connect-mongo';

const LikedSongs = () => {
    const user = useLoaderData();
    const navigate = useNavigate();
    const [tracks, setTracks] = useState([]);
    const [clickedTracks, setClickedTracks] = useState([]);

    // fetch data submitted by login form

    useEffect( () => {
        const fetchTracks = async () => {
            try {
                const fetchedTracks = await axios.post('/api/music/fetchLikedSongs', {
                    user,
                })

                const extractTracks = fetchedTracks.data.tracks.items.map( (obj) => obj.track);
                setTracks(extractTracks);
            } catch(err) {
                console.error('Error fetching tracks: ', err);
            }
        }

        fetchTracks();
    }, [user])

    const handleCardClick = createHandleCardClick(setClickedTracks);

    return (
        <div className="w-100 bg-beige">
            <NavBar user={user} idList={clickedTracks} setClickedTracks={setClickedTracks} setTracks={setTracks}/>
            <div className='mt-4 mx-4 pb-4 grid grid-cols-4 gap-6'>
                {
                    tracks && (tracks.map( (track) => (
                        <TrackCard track={track} handleCardClick={handleCardClick} isClicked={clickedTracks.includes(track.id)}/>
                    )))
                }
            </div>
        </div>
    )

}

export default LikedSongs