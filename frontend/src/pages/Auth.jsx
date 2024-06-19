import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpotify} from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

// should pass in a user possibly
    // response from call to authorization endpoint should be stored
    // and used to update the current user's information
const Auth = () => {

    const handleAuth = async (e) => {
            e.preventDefault();
            console.log('In Authentication handler');
            // to receive from callback:
                // access_token
                // token_type
                // scope
                // expires_in
                // refresh_token
            // maybe make a separate model for tokens
                // User can have a token document
            // from response make a post request to update user information
            try {
                const response = await axios.get('/api/music/login', {
                    headers: {
                        'Access-Control-Allow-Origin': 'http://localhost:3000/',
                    }
                });
                console.log(response);
                const authorize_url = response.data.auth_data;
                console.log(`Authorization URL received from backend ${authorize_url}`);
                window.open(authorize_url, '_blank'); 
            } catch(err) {
                console.log(err);
            }
    }
    //change to frontend
    return (
        <form onSubmit={handleAuth}>
            <div className="absolute bottom-0 left-0 bg-beige size-full p-0 mx-auto">
                <div className='relative top-1/4 bg-brown3 backdrop-saturate-2 shadow-inner drop-shadow-xl w-8/12 h-3/6 mx-auto rounded-xl text-center'>
                    <header className="bg-beige drop-shadow-xl rounded-t-xl">
                        <h1 className='py-6 font-bold text-xl text-brown3'>Authorize Via Spotify</h1>
                    </header>
                    <FontAwesomeIcon icon={faSpotify} size="8x" className='mt-16 text-beige'/>
                    <button type="submit" value="submit" className="block p-2 bg-beige mx-auto rounded-xl text-brown-3 mt-10 font-bold">Proceed</button>
                </div>
            </div>
        </form>
    );
}

export default Auth