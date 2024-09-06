import {
  createBrowserRouter,  
  RouterProvider, 
  redirect, 
  createRoutesFromElements,
  Route} from 'react-router-dom'
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import axios from 'axios';

// pages, components & context
import userContext from './userContext';
import Auth from './pages/Auth';
import LikedSongs from './pages/LikedSongs';
import Login from './pages/Login';
import TopTracks from './pages/TopTracks';
import Playlists from './pages/Playlists';

// loader to update user's token and pass the user to respective component
// first fetches user
  // passes user into update function
    // update func returns updated user
const userLoader = async () => {
  try {
    // retrieve user's information stored in session
    let user = await axios.get('/api/music/getUser');
    
    // access token has expired
    if(Date.now() >= user.tokenExpiration) {
      // update the user's tokens
      // placing expiration check here prevents updateUser from being called every render
      user = await axios.put('/api/music/updateUser', {
        user: user
      })
    }

    return user;
  } catch (err) {
    console.error(err);
    return redirect('/login');
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path:'/login',
    element: <Login />,
    // loader: loginLoader,
    // check if the code & state are the same as before, if this is the case, the user has simply refreshed the page
    // create and store the user before
    // shouldRevalidate: ( currentUrl, nextUrl ) => { // avoid revalidation if url is the same
    //   console.log('Current url:', currentUrl);
    //   console.log('Next Url:', nextUrl);
    //   return currentUrl.pathname !== nextUrl.pathname
    // },
  },
  {
    path: "/likedsongs",
    element: <LikedSongs/>,
    loader: userLoader
  },
  {
    path:'/toptracks',
    element: <TopTracks/>,
    loader: userLoader
  },
  {
    path:'/playlists',
    element: <Playlists/>,
    loader: userLoader
  }
])

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <userContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
    </userContext.Provider>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);