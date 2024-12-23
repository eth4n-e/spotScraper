import { useEffect, useState } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import NavBar from '../components/NavBar';
import TrackCard from '../components/TrackCard';
import axios from 'axios';

const LikedSongs = () => {
    const user = useLoaderData();
    const navigate = useNavigate();
    const [tracks, setTracks] = useState([]);
    const [clickedTracks, setClickedTracks] = useState([]);
    const [counter, setCounter] = useState(0);

    // fetch data submitted by login form

    useEffect( () => {
        const fetchTracks = async () => {
            try {
                const fetchedTracks = await axios.post('/api/music/fetchLikedSongs', {
                    user,
                })

                console.log(fetchedTracks);

                const extractTracks = fetchedTracks.data.tracks.items.map( (obj) => obj.track);
                setTracks(extractTracks);

                console.log(tracks);
            } catch(err) {
                console.error('Error fetching tracks: ', err);
            }
        }

        fetchTracks();
    }, [user])

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
            setCounter(updatedTrackList.length);

            return updatedTrackList;
        });
    }

    return (
        <div className="w-100 bg-beige">
            <NavBar profilePic={user.profilePic} buttonType={"Delete"} counter={counter}/>
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