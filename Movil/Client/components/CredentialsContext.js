import { createContext } from "react";

//credentials context
export default CredentialContext = createContext({storedCredentials: {}, setStoredCredentials: () => {}})