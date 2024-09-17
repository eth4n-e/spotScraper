import { createContext } from "react";

// function signature is necessary when defining setUser function
    // implementation will be passed to the context provider
const userContext = createContext({
    user: null,
    setUser: (user) => user
});

export default userContext;