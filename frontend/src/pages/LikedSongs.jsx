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
                console.log('In try block');
                const fetchedTracks = await axios.post('/api/music/fetchSpotifyTracks', {
                    token: user.accessToken,
                    country: user.country,
                })

                console.log('Tracks from frontend:', fetchedTracks);

                setTracks(fetchedTracks.data.items);

                console.log(tracks);
            } catch(err) {
                console.error('Error fetching tracks: ', err);
            }
        }

        fetchTracks();
        // return () => {
        //     ignore = true;
        // }
    }, [user.accessToken, user.country, tracks])

    return (
        <div>
            <Navbar profilePic={user.profilePic}/>
            <p>{tracks}</p>
        </div>
    )

}

export default LikedSongs