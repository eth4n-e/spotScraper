import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [ loadEffState, setLoadEffState ] = useState(true);
    // fetch data for user
    useEffect( () => {
        // axios call to backend controller to handle callback logic
        const fetchUserData = async () => {
            setLoadEffState(false);

            // fetch parameters from url to pass to backend route
            const urlParams = new URLSearchParams(window.location.search);
            const spotCode = urlParams.get('code');
            const spotState = urlParams.get('state');
         
            // user denied permissions
            if(spotCode == null) {
                // I want to set up a message here
                    // something like: "spotScraper was denied access to profile"
                navigate('/');
            } else { // continue with PKCE flow
                try {
                    console.log('in try block');
                    const codeVerifier = window.localStorage.getItem('code_verifier');

                    const response = await axios.post('http://localhost:4000/api/music/home', {
                        code_verifier: codeVerifier,
                        code: spotCode,
                        state: spotState,
                    });
                    console.log(response);
                } catch (err) {
                    console.log(err);
                }
            }
        }

        fetchUserData();
    }, [ loadEffState ]); // empty parameter list, only want 

    return (
        <h1>Home Page</h1>
    )

}

export default Home