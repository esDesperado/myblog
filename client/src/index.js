import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from "./store/UserStore";
import InterfaceStore from "./store/InterfaceStore";
import('./styles/body.css');
export const Context = createContext(null)
ReactDOM.render(
    <Context.Provider value={{
        user: new UserStore(),
        inface: new InterfaceStore(),
    }}>
        <App />
    </Context.Provider>,
    document.getElementById('root')
);
