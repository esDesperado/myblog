import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from "./store/UserStore";
import ProductStore from "./store/ProductStore";
import InterfaceStore from "./store/InterfaceStore";
import('./styles/BackEnd.css');
import('./styles/UserHeader.css');
import('./styles/reg&log.css');
import('./styles/body.css');
import('./styles/anim.css');
export const Context = createContext(null)


ReactDOM.render(
    <Context.Provider value={{
        user: new UserStore(),
        product: new ProductStore(),
        inface: new InterfaceStore(),
    }}>
        <App />
    </Context.Provider>,


    document.getElementById('root')
);
