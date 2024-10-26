import NavBar from "../components/NavBar";
import TrackCard from "../components/TrackCard";
import { useLoaderData } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"

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

    const handleCardClick = (id) => {
        // have to update list in a state setter for React to handle properly
        setClickedTracks(prevList => {
            let updatedTrackList = [];

            if (prevList.indexOf(id) === -1) { // track not present in list
                updatedTrackList = [...prevList, id];
            } else {
                // create new array without element that was clicked
                updatedTrackList = prevList.filter(trackId => trackId !== id);
            }

            return updatedTrackList;
        });
    }

    return (
        <div className="w-100 bg-beige">
            <NavBar user={user} idList={clickedTracks}/>
            <div className='mt-6 pb-4 mx-4 grid grid-cols-4 gap-6'>
                {
                    topTracks && (topTracks.map( (track) => (
                        // whenever handleCardClick is invoked in TrackCard component (updates state in this component) a re-render triggers
                        // that's why isClicked can be updated
                        <TrackCard track={track} handleCardClick={handleCardClick} isClicked={clickedTracks.includes(track.id)}/> 
                    )))
                }
            </div>
        </div>
    )
}

export default TopTracks