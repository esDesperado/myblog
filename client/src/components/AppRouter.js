import React, {useContext,useEffect} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {adminRoutes,publicRoutes} from "../routes.js";
import {Context} from "../index";
import {MP_ROUTE,ADMIN_ROUTE} from "../utils/consts";
import {observer} from "mobx-react-lite";
import MainPage from "../pages/other/MainPage";
import {NavLink,useNavigate} from "react-router-dom";

const  AppRouter =  observer(() => {
    const {user,inface} = useContext(Context)
    const navigate = useNavigate()
    if(inface.pages.length > 0 && inface.pages.filter(page=>page.path === document.location.pathname.replace('/','')).length === 0 && !document.location.pathname.includes('admin')){setTimeout(()=>{if(inface.pages.filter(page=>page.path === document.location.pathname.replace('/','')).length === 0){if(inface.pages.filter(page=>page.path === '').length > 0){navigate('/')}else{navigate('/'+inface.pages[0].path)}}},100)}
    //<Route exact path="*" element={<Navigate replace={true} to={MP_ROUTE} /> } />

    useEffect(()=>{
        if(!document.location.pathname.includes('admin')){document.title = inface.pages.length > 0?inface.pages.filter(d=>d.path === document.location.pathname.replace('/',''))[0].title:'Главная'}
    },[inface.pages.length])
    /*
    {publicRoutes.map(({path, Component}) =>

        <Route exact key={path} path={path} element={<Component />} />
    )}*/
    return(
        <Routes>
            {inface.pages.slice().sort().map((page) =>
                <Route exact key={page.path+ADMIN_ROUTE} path={page.path+ADMIN_ROUTE} element={<MainPage />} />
            )}
            {inface.pages.slice().sort().map((page) =>
                <Route exact key={'/'+page.path} path={'/'+page.path} element={<MainPage />} />
            )}





        </Routes>
    );
});





export default AppRouter;