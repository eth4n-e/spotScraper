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

// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <div className="pages">
//           <Routes>
//             <Route
//               path='/'
//               element={<Auth />}
//             />
//             <Route
//               path='/login'
//               element={<Login />}
//             />
//             <Route
//               path='/home'
//               element={<Home />}
//             />
//           </Routes>
//         </div>
//       </BrowserRouter>
//     </div>
//   );
// }

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

      // const accessToken = tokenResponse.access_token;
      // const refreshToken = tokenResponse.refresh_token;
      // const expiresIn = tokenResponse.expires_in;

      // console.log('Token', accessToken);

      // const userResponse = await axios.post('/api/music/user', {
      //   accessToken,
      //   refreshToken,
      //   expiresIn,
      // });

      return tokenResponse;

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
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// export default App;