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

  console.log('Code', spotCode);
  console.log('State', spotState);

  // user denied permissions
  if(spotCode == null) {
    // I want to set up a message here
        // something like: "spotScraper was denied access to profile"
    // return redirect('/');
    console.log('Null spotCode');
  } else { // continue with PKCE flow
    try {
        const codeVerifier = window.localStorage.getItem('code_verifier');

        console.log(codeVerifier);

        const response = await axios.post('/api/music/home', {
            code_verifier: codeVerifier,
            code: spotCode,
            state: spotState,
        });

        return response;

    } catch (err) {
        console.log(err);
    }
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