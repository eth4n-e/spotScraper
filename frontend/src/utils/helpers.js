import { redirect } from "react-router-dom";
import axios from "axios";

export const createHandleCardClick = ({stateUpdateFunction}) => {
    
    // return function which updates list of items (tracks, playlists)
    // takes as parameter the appropriate state updating function
    return (id) => {
        // have to update list in a state setter for React to handle properly
        stateUpdateFunction(prevList => {
            let updatedArr = [];

            if (prevList.indexOf(id) === -1) { // track not present in list
                updatedArr = [...prevList, id];
            } else {
                // create new array without element that was clicked
                updatedArr = prevList.filter(trackId => trackId !== id);
            }

            // updated list becomes the new state upon return
            return updatedArr;
        });
    }
}

// method which updates user token and session data if necessary
// runs on every page load of liked songs, top tracks, playlists
export const userLoader = async function() {
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