import React from 'react';
import { IAuth, defaultAuth } from "../interfaces/IAuth";

const AuthContext = React.createContext(defaultAuth);

export {AuthContext as default};