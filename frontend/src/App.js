import {BrowserRouter, Routes, Route } from 'react-router-dom'

// pages & components
import Auth from './pages/Auth';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route
              path='/'
              element={<Auth />}
            />
            <Route
              path='/login'
              element={<Login />}
            />
            <Route
              path='/home'
              element={<Home />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;