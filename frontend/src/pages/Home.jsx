import { useEffect } from 'react';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';


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
const Home = () => {

    // fetch data for user
    useEffect( () => {
        // axios call to backend controller to handle callback logic
        const fetchUserData = async () => {
            // fetch parameters from url to pass to backend route
            const urlParams = new URLSearchParams(window.location.search);
            const spotCode = urlParams.get('code');
            const spotState = urlParams.get('state');

            try {
                const response = await axios.get('/api/music/home', {
                    params: {
                        code: spotCode,
                        state: spotState,
                    }
                });

                console.log(response.data.access_token);
            } catch (err) {
                console.log(err);
            }
        }

        fetchUserData();
    }, []); // empty parameter list, only want 

    return (
        <h1>Home Page</h1>
    )

}

export default Home