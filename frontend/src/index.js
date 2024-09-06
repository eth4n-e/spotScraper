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

const likedLoader = async () => {
  try {
    const userSession = await axios.get('/api/music/getUser');

    const res = await axios.put('/api/music/updateUser', {
      user: userSession
    });

    const updatedUser = await axios.get('/api/music/getUser');

    return updatedUser;
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
    loader: likedLoader
  },
  {
    path:'/toptracks',
    element: <TopTracks/>,
  },
  {
    path:'/playlists',
    element: <Playlists/>,
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