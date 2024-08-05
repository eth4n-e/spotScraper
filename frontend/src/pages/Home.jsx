import { useEffect, useState } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
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
const Home = () => {
    const navigate = useNavigate();
    const accessData = useLoaderData();

    console.log('Profile pic homepage: ', accessData.data.profilePic);
    return (
        <div>
            <Navbar profilePic={accessData.data.profilePic}/>
            <h1>Home Page</h1>
            <img src={accessData.data.profilePic} alt="Profile Pic"/>
        </div>
    )

}

export default Home