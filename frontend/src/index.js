import {
  createBrowserRouter,  
  RouterProvider, 
} from 'react-router-dom'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { userLoader } from './utils/helpers';

// pages & components
import Auth from './pages/Auth';
import LikedSongs from './pages/LikedSongs';
import Login from './pages/Login';
import TopTracks from './pages/TopTracks';
import Playlists from './pages/Playlists';

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