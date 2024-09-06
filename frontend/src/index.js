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

// const loginLoader = async () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const spotCode = urlParams.get('code');
//   const spotState = urlParams.get('state');

//   try {
//       // make request to backend controller which handles token exchange
//       const tokenResponse = await axios.post('/api/music/getToken', {
//           code: spotCode,
//           state: spotState,
//       });

//       // axios automatically parses the response to a JSON object (unlike fetch)
//       return tokenResponse;
//   } catch (err) {
//       console.error(err);
//       // Authorization was denied, redirect back to authorize page
//       return redirect('/');
//   }
// }

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// export default App;