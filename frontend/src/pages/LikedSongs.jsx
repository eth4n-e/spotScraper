import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from 'axios';
//  import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


/*
    - need to pass in a User 
        - use User data to make client-side requests to fetch:
            - top tracks
            - spotify profile picture
        - use a useEffect hook at the top of the function
    - not sure of use of useState & useContext here
        - use state to manage internal state of component (changing info related only to the home page)
        - use context to manage data / state across several components
*/
const LikedSongs = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [tracks, setTracks] = useState([]);
    // fetch data submitted by login form
    const user  = location.state?.user;

    useEffect( () => {
        // async function fetchTracks() {
        //     const trackData = await axios.post('/api/music/getSpotifyTracks', {
        //         token: user.accessToken,
        //         country: user.country,
        //     });

        //     console.log('Track Data frontend:', trackData);

        //     // if(!ignore) {
        //     //     setTracks(trackData.data);
        //     // }
        //     setTracks(trackData.data);
        // }

        // // let ignore = false;

        // fetchTracks();
        const fetchTracks = async () => {
            try {
                const fetchedTracks = await axios.post('/api/music/fetchSpotifyTracks', {
                    token: user.accessToken,
                    country: user.country,
                })

                const extractTracks = fetchedTracks.data.items.map( (obj) => obj.track);
                setTracks(extractTracks);

                console.log(tracks);
            } catch(err) {
                console.error('Error fetching tracks: ', err);
            }
        }

        fetchTracks();
        // return () => {
        //     ignore = true;
        // }
    }, [user.accessToken, user.country])

    return (
        <div className="w-100 bg-beige">
            <Navbar profilePic={user.profilePic}/>
            <div className='mt-4 mx-4 grid grid-cols-4 gap-6'>
                {
                    tracks && (tracks.map( (track) => (
                    <div className="bg-brown3 rounded-md p-1" key={track.id}>
                        <img className="object-cover rounded-md" src={track.album.images[0].url} alt="Track cover"/>
                        <p className="text-beige font-semibold">{track.name} by {track.artists[0].name}</p>
                    </div>  
                    )))
                }
            </div>
        </div>
    )

}

export default LikedSongs