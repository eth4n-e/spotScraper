import { useEffect, useState } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
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
const Home = () => {
    // const navigate = useNavigate();
    const accessData = useLoaderData();
    console.log(accessData);

    // const [accessToken, setAccessToken] = useState('');
    // const [refreshToken, setRefreshToken] = useState('');

    // setAccessToken(accessData.access_token);
    // setRefreshToken(accessData.refresh_token);

    // console.log('Access token: ', accessToken);
    // console.log('Refresh token: ', refreshToken);
    // // maybe create states for access_token, refresh_token, etc.
    // // update these after receiving a response from the backend
    // // use these states to perform a request to create a new user

    // // fetch data for user
    // useEffect( () => {
    //     // axios call to backend controller to handle callback logic
    //     const fetchUserData = async () => {
    //         // setLoadEffState(false);
    //         // fetch parameters from url to pass to backend route
    //         const urlParams = new URLSearchParams(window.location.search);
    //         const spotCode = urlParams.get('code');
    //         const spotState = urlParams.get('state');
         
    //         // user denied permissions
    //         if(spotCode == null) {
    //             // I want to set up a message here
    //                 // something like: "spotScraper was denied access to profile"
    //             navigate('/');
    //         } else { // continue with PKCE flow
    //             try {
    //                 const codeVerifier = window.localStorage.getItem('code_verifier');

    //                 console.log("CodeVerifier on frontend:", codeVerifier)

    //                 const response = await axios.post('/api/music/home', {
    //                     code_verifier: codeVerifier,
    //                     code: spotCode,
    //                     state: spotState,
    //                 });
    //                 console.log(response);
    //                 // if response contains access_token, etc. make another request to instantiate a user
    //                 setAccessToken(response.data.access_token);
    //                 setRefreshToken(response.data.refresh_token);
    //             } catch (err) {
    //                 console.log(err);
    //             }
    //         }
    //     }

    //     fetchUserData();
    // }, []); // empty parameter list, only want the effect to trigger once

    // console.log(accessToken);
    // console.log(refreshToken);

    return (
        <div>
            <h1>Home Page</h1>
        </div>
    )

}

export default Home