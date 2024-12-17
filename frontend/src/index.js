import {
  createBrowserRouter,  
  RouterProvider, 
  redirect, 
  createRoutesFromElements,
  Route} from 'react-router-dom'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import axios from 'axios';

// pages & components
import Auth from './pages/Auth';
import LikedSongs from './pages/LikedSongs';
import Login from './pages/Login';
import TopTracks from './pages/TopTracks';
import Playlists from './pages/Playlists';

const userLoader = async () => {
  try {
    const userSession = await axios.get('/api/music/getUser');

    let user = userSession.data.user;
    
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
    // can redirect to login because user should exist by this point
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
  },
  {
    path: "/likedsongs",
    element: <LikedSongs/>,
    loader: userLoader,
  },
  {
    path:'/toptracks',
    element: <TopTracks/>,
    loader: userLoader,
  },
  {
    path:'/playlists',
    element: <Playlists/>,
    loader: userLoader,
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);