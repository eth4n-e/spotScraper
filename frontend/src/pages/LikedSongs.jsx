import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLoaderData, useLocation } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from 'axios';
import userContext from '../userContext'


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
    const userRender = useLoaderData();
    const [user, setUser] = useState(userRender.data.user);
    const navigate = useNavigate();

    console.log(user);

    return (
        <div>
            <Navbar user={user} profilePic={user.profilePic}/>
            <h1>Home Page</h1>
            <p>{user.email}</p>
        </div>
    )

}

export default LikedSongs