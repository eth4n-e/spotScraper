import {React, useState} from 'react';
import { useNavigate, useLoaderData, Form } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const tokenData = useLoaderData();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // submit form
        // pass token which was received upon render
        // use token to create a new user w/ given email and password
            // if user already exists, return existing user
    const handleSubmit = async (e, token) => {
        e.preventDefault();

        try {
            const accessToken = token.access_token;
            const refreshToken = token.refresh_token;
            const expiresIn = token.expires_in;

            // create user / return existing user
            const userResponse = await axios.post('/api/music/login', {
                accessToken,
                refreshToken,
                expiresIn,
                email,
                password,
            })

            //  navigate to likedsongs while passing user data to the page
                // data will be fetched with useLocation
            navigate('/likedsongs', { state: { user: userResponse.data } })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="h-screen flex flex-1 flex-col justify-center bg-beige">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className='-mt-4 text-center text-2xl font-extrabold leading-9 tracking-tight text-brown3'>
                        Sign in
                    </h2>
                </div>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <Form className="space-y-6" onSubmit={(e) => handleSubmit(e, tokenData.data)}>
                        <div>
                            <label htmlFor="email" className="block text-base font-semibold leading-6 text-brown3">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                placeholder="Email connected to your Spotify account"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 px-1 text-brown2 shadow-sm ring-1 ring-inset ring-brown3 placeholder:text-brown1 placeholder:italic focus:ring-2 focus:ring-inset focus:ring-brown3 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-base font-semibold leading-6 text-brown3">
                                Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                placeholder="8 character password"
                                minLength={8}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 px-1 text-brown2 shadow-sm ring-1 ring-inset ring-brown3 placeholder:text-brown1 placeholder:italic focus:ring-2 focus:ring-inset focus:ring-brown3 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="flex w-full mt-10 justify-center rounded-md bg-brown3 px-3 py-1.5 text-sm font-semibold leading-6 text-beige shadow-md hover:bg-brown2 hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-brown3"
                            >
                                Sign in
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
    );
}

export default Login