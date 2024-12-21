import NavBar from "../components/NavBar";
import TrackCard from "../components/TrackCard";
import ClickedTrackCard from "../components/ClickedTrackCard.jsx";
import { useLoaderData } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { createHandleCardClick } from '../utils/helpers.js';

const TopTracks = () => {
    const user = useLoaderData();
    const [topTracks, setTopTracks] = useState([]);
    const [clickedTracks, setClickedTracks] = useState([]);

    useEffect( () => {
        const fetchTopTracks = async (user) => {
            
            const trackResponse = await axios.post('/api/music/fetchTopTracks', {
                user
            });

            // use set to remove duplicates
            const uniqueTracks = new Set(trackResponse.data.tracks);

            // convert back to array to make use of map functionality to transform the data into renderable components
            const tracks = Array.from(uniqueTracks);

            setTopTracks(tracks);
        }
        fetchTopTracks(user);
    }, [user]);

    const handleCardClick = createHandleCardClick(setClickedTracks);

    return (
        <div className="w-100 bg-beige">
            <NavBar user={user} itemIds={clickedTracks} setClickedCards={setClickedTracks}/>
            <div className='mt-6 pb-4 mx-4 grid grid-cols-4 gap-6'>
                {
                    topTracks && (topTracks.map( (track) => (
                        clickedTracks.includes(track.id) ? (
                            <ClickedTrackCard track={track} handleCardClick={handleCardClick} key={track.id}/>
                        ) : (
                            <TrackCard track={track} handleCardClick={handleCardClick} key={track.id}/> 
                        )
                    )))
                }
            </div>
        </div>
    )
}

export default TopTracks