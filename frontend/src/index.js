import {
  createBrowserRouter,  
  RouterProvider, 
  redirect } from 'react-router-dom'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import axios from 'axios';

// pages & components
import Auth from './pages/Auth';
import Home from './pages/Home';
import TopTracks from './pages/TopTracks';
import Playlists from './pages/Playlists';

const homeDataLoader = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const spotCode = urlParams.get('code');
  const spotState = urlParams.get('state');

  try {
      const codeVerifier = window.localStorage.getItem('code_verifier');
      // make request to backend controller which handles token exchange
      const tokenResponse = await axios.post('/api/music/home', {
          code_verifier: codeVerifier,
          code: spotCode,
          state: spotState,
      });

      const accessToken = tokenResponse.data.access_token;
      const refreshToken = tokenResponse.data.refresh_token;
      const expiresIn = tokenResponse.data.expires_in;

      const userResponse = await axios.post('/api/music/user', {
        accessToken,
        refreshToken,
        expiresIn,
      });

      // axios automatically parses the response to a JSON object (unlike fetch)
      return userResponse;

  } catch (err) {
      console.error(err);
      // Authorization was denied, redirect back to authorize page
      return redirect('/');
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/home",
    element: <Home/>,
    loader: homeDataLoader,
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// export default App;