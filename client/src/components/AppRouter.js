import React, {useContext} from 'react';
import {Routes, Route} from 'react-router-dom';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import MainPage from "../pages/other/MainPage";
import Login from "../pages/other/Login";
const  AppRouter =  observer(() => {
    return(
        <Routes>
            <Route exact path={'/'} element={<MainPage />} />
            <Route exact path={'/login'} element={<Login />} />
        </Routes>
    );
});





export default AppRouter;