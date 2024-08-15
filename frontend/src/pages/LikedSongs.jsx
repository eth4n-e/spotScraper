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
        async function fetchTracks() {
            const trackData = await axios.get('/api/music/getSpotifyTracks', {
                token: user.accessToken,
                country: user.country,
            });

            if(!ignore) {
                setTracks(trackData.data);
            }
        }
        let ignore = false;
        fetchTracks();
        return () => {
            ignore = true;
        }
    }, [user.accessToken, user.country])

    return (
        <div>
            <Navbar profilePic={user.profilePic}/>
            <div>

            </div>
        </div>
    )

}

export default LikedSongs