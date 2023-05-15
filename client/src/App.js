import React, {useContext, useState, useEffect} from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter"
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {check,fetchComponents,getInterface,fetchBlocks} from "./http/API";
const App = observer(() => {
    const {user,inface} = useContext(Context)
    useEffect(()=>{
        if(user.role > 0){
            const timer = setInterval(()=>{
                check().then(data => {
                    if(data.role !== user.role){user.setRole(data.role)}
                }).catch(data=>{user.setRole(0)})
            },12500)
            return () => clearTimeout(timer)
        }
    },[user.role])
    useEffect(()=>{
        if(document.documentElement.clientHeight > inface.height + 5){
            inface.setHeight(document.documentElement.clientHeight)
            //document.getElementById('theOnlyOneBody').style.minHeight = document.documentElement.clientHeight + 'px'
        }
        window.addEventListener('resize', ()=> {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                if(!inface.mobile){
                    inface.setMobile(true)
                }
            }else if(inface.mobile){
                inface.setMobile(false)
            }
            if(document.documentElement.clientWidth > inface.width + 20 || document.documentElement.clientWidth < inface.width - 20){
                inface.setWidth(document.documentElement.clientWidth)
                if(document.documentElement.clientHeight < inface.height + 20){
                    inface.setHeight(document.documentElement.clientHeight)
                    //document.getElementById('theOnlyOneBody').style.minHeight = document.documentElement.clientHeight + 'px'
                }
            }
            if(document.documentElement.clientHeight > inface.height + 5){
                inface.setHeight(document.documentElement.clientHeight)
                //document.getElementById('theOnlyOneBody').style.minHeight = document.documentElement.clientHeight + 'px'
            }
        });
    },[document.documentElement.clientHeight])
    const [loading, setLoading] = useState(true)
    if(new Date().toISOString().split('T')[0] !== localStorage.getItem('tryDate') && localStorage.getItem('tryCount')){localStorage.removeItem('tryCount')}
    if(new Date().toISOString().split('T')[0] !== localStorage.getItem('callCond')){localStorage.removeItem('callCond')}
    if(new Date().toISOString().split('T')[0] !== localStorage.getItem('quizCond')){localStorage.removeItem('quizCond')}
    useEffect(()=>{
        /*
        let form = new FormData()
        form.append('title','11')
        changeSite('getHash',form).then(data=>console.log(data))*/
        if(localStorage.getItem('panColor')){inface.setAcolor(localStorage.getItem('panColor'))}
        if(localStorage.getItem('panBack')){inface.setAback(localStorage.getItem('panBack'))}
        if(document.querySelector('#mainCI') && inface.interface.main){document.querySelector('#mainCI').value = inface.interface.main}
        if(document.querySelector('#backCI') && inface.interface.background){document.querySelector('#backCI').value = inface.interface.background}
        if(document.querySelector('#fontCI') && inface.interface.color){document.querySelector('#fontCI').value = inface.interface.color}
        if(document.querySelector('#panColor')){document.querySelector('#panColor').value = inface.acolor}
        if(document.querySelector('#panBack')){document.querySelector('#panBack').value = inface.aback}
    },[inface.interface,user.role])
    useEffect(()=>{
        if(inface.interface.id > -1){}else{
            getInterface().then(data=>{
                inface.setInterface(data)
                let link = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.getElementsByTagName('head')[0].appendChild(link);
                }
                link.href = process.env.REACT_APP_API_URL + data.favicon;
                document.getElementById('theOnlyOneBody').style.backgroundColor = data.mainColor
                document.getElementById('theOnlyOneBody').style.color = data.fontColor
            })
        }
        if(!inface.components.length){
            fetchComponents().then(data=>{
                inface.setComponents(data)
            })
        }
        if(!inface.blocks.length || !inface.pages.length || !inface.images.length){
            fetchBlocks().then(data=>{inface.setBlocks(data.blocks);inface.setPages(data.pages);inface.setImages(data.images);inface.setPatterns(data.patterns)})
        }
        if(user.role === 0){
            window.addEventListener('storage', (event) => {
                if (event.storageArea !== localStorage){}else{
                if (event.key === 'token') {
                    check().then(data => {
                        if(user.role !== data.role){console.log(data.role);user.setRole(data.role)}
                    }).catch(data=>{
                        user.setRole(0)
                    }).finally(()=>{setLoading(false)})
                }}
            });
            check().then(data => {
                if(user.role !== data.role){user.setRole(data.role)}
            }).catch(data=>{
                user.setRole(0)
            }).finally(()=>{setLoading(false)})
        }
    },[user.role,window.localStorage.getItem('token'),localStorage.getItem('token')])
    useEffect(()=>{
        if(inface.interface.js){
            try{window.eval(inface.interface.js)}catch(err){console.error('Ошибка во время исполнения кода: \n\n',err)}
        }
    },[inface.interface.js])
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        if(!inface.mobile){
            inface.setMobile(true)
        }
    }else if(inface.mobile){
        inface.setMobile(false)
    }
    if(loading){
        return(
            <div style={{background:'white',width:inface.width + 'px',height:window.innerHeight > inface.height?window.innerHeight + 'px':inface.height + 'px',position:'fixed',top:'0',left:'0'}}>
                <div className="spin-wrapper">
                    <div style={{color:'white',display:'inline-block',height:'15em'}}>Пожалуйста, подождите.</div>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <style>{inface.interface.css}</style>
            <AppRouter/>
            <svg display='none' preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <symbol fill="none" id='cartSVG' >
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.5 3m0 0L7 15h11l3-9H5.5z"/>
                    <circle cx="8" cy="20" r="1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                    <circle cx="17" cy="20" r="1" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                </symbol>
                <symbol id='chartSVG'>
                    <path d="M9 6h2v14H9zm4 2h2v12h-2zm4-4h2v16h-2zM5 12h2v8H5z"/>
                </symbol>
                <symbol id='heartSVG'>
                    <g data-name="Layer 2"><g data-name="heart"><rect width="24" height="24" opacity="0"/><path d="M12 21a1 1 0 0 1-.71-.29l-7.77-7.78a5.26 5.26 0 0 1 0-7.4 5.24 5.24 0 0 1 7.4 0L12 6.61l1.08-1.08a5.24 5.24 0 0 1 7.4 0 5.26 5.26 0 0 1 0 7.4l-7.77 7.78A1 1 0 0 1 12 21zM7.22 6a3.2 3.2 0 0 0-2.28.94 3.24 3.24 0 0 0 0 4.57L12 18.58l7.06-7.07a3.24 3.24 0 0 0 0-4.57 3.32 3.32 0 0 0-4.56 0l-1.79 1.8a1 1 0 0 1-1.42 0L9.5 6.94A3.2 3.2 0 0 0 7.22 6z"/></g></g>
                </symbol>
                <symbol id='crossSVG'>
                    <g>
                        <path d="M55.931,47.463L94.306,9.09c0.826-0.827,0.826-2.167,0-2.994L88.833,0.62C88.436,0.224,87.896,0,87.335,0
                            c-0.562,0-1.101,0.224-1.498,0.62L47.463,38.994L9.089,0.62c-0.795-0.795-2.202-0.794-2.995,0L0.622,6.096
                            c-0.827,0.827-0.827,2.167,0,2.994l38.374,38.373L0.622,85.836c-0.827,0.827-0.827,2.167,0,2.994l5.473,5.476
                            c0.397,0.396,0.936,0.62,1.498,0.62s1.1-0.224,1.497-0.62l38.374-38.374l38.374,38.374c0.397,0.396,0.937,0.62,1.498,0.62
                            s1.101-0.224,1.498-0.62l5.473-5.476c0.826-0.827,0.826-2.167,0-2.994L55.931,47.463z"/>
                    </g>
                </symbol>
                <symbol id='phoneSVG'>
                    <path d="M53.364,40.908c-2.008-3.796-8.981-7.912-9.288-8.092c-0.896-0.51-1.831-0.78-2.706-0.78c-1.301,0-2.366,0.596-3.011,1.68
                    c-1.02,1.22-2.285,2.646-2.592,2.867c-2.376,1.612-4.236,1.429-6.294-0.629L17.987,24.467c-2.045-2.045-2.233-3.928-0.632-6.291
                    c0.224-0.309,1.65-1.575,2.87-2.596c0.778-0.463,1.312-1.151,1.546-1.995c0.311-1.123,0.082-2.444-0.652-3.731
                    c-0.173-0.296-4.291-7.27-8.085-9.277c-0.708-0.375-1.506-0.573-2.306-0.573c-1.318,0-2.558,0.514-3.49,1.445L4.7,3.986
                    c-4.014,4.013-5.467,8.562-4.321,13.52c0.956,4.132,3.742,8.529,8.282,13.068l14.705,14.705c5.746,5.746,11.224,8.66,16.282,8.66
                    c0,0,0,0,0.001,0c3.72,0,7.188-1.581,10.305-4.698l2.537-2.537C54.033,45.163,54.383,42.833,53.364,40.908z"/>
                </symbol>
                <symbol id='deleteSVG'>
                    <g>
                        <path d="M317.667,214.42l5.667-86.42h20.951V38h-98.384V0H132.669v38H34.285v90h20.951l20,305h140.571
                            c23.578,24.635,56.766,40,93.478,40c71.368,0,129.43-58.062,129.43-129.43C438.715,275.019,385.143,218.755,317.667,214.42z
                             M162.669,30h53.232v8h-53.232V30z M64.285,68h250v30h-250V68z M103.334,403L85.301,128H293.27l-5.77,87.985
                            c-61.031,10.388-107.645,63.642-107.645,127.586c0,21.411,5.231,41.622,14.475,59.43H103.334z M309.285,443
                            c-54.826,0-99.43-44.604-99.43-99.43s44.604-99.429,99.43-99.429s99.43,44.604,99.43,99.429S364.111,443,309.285,443z"/>
                        <polygon points="342.248,289.395 309.285,322.358 276.322,289.395 255.109,310.608 288.072,343.571 255.109,376.533
                            276.322,397.746 309.285,364.783 342.248,397.746 363.461,376.533 330.498,343.571 363.461,310.608 	"/>
                    </g>
                </symbol>
                <symbol id='arrowSVG'>
                    <path d="M73.698,177.399l0.001-107.401L29.787,70L88.699,0l58.914,69.997l-43.914,0.001l-0.001,107.401H73.698z"/>
                </symbol>
                <symbol id='plusSVG'>
                    <path d="M54.454,23.18l-18.609-0.002L35.844,5.91C35.845,2.646,33.198,0,29.934,0c-3.263,0-5.909,2.646-5.909,5.91v17.269
                    L5.91,23.178C2.646,23.179,0,25.825,0,29.088c0.002,3.264,2.646,5.909,5.91,5.909h18.115v19.457c0,3.267,2.646,5.91,5.91,5.91
                    c3.264,0,5.909-2.646,5.91-5.908V34.997h18.611c3.262,0,5.908-2.645,5.908-5.907C60.367,25.824,57.718,23.178,54.454,23.18z"/>
                </symbol>
                <symbol id='linesSVG'>
                    <polygon fill="white" opacity="0.2" points="90,0 180,0 90,180 0,180" />
                </symbol>
                <symbol id='exitSVG'>
                    <path
                          id="path1747"
                          style={{strokeLineJoin:'round',stroke:inface.acolor2,strokeLineCap:'round',strokeWidth:'5',fill:'none'}}
                          transform="translate(50 5.1993e-7)"
                          d="m-12.504 11.725v7.822c6.0611 3.209 9.5062 9.95 8.2982 16.894-1.3504 7.763-8.0632 13.336-15.942 13.265-7.879-0.07-14.493-5.806-15.704-13.592-1.07-6.879 2.376-13.509 8.358-16.656v-7.703c-7.92 2.716-13.607 9.403-15.228 17.251-0.547 2.647-0.614 5.411-0.179 8.209 1.74 11.19 11.37 19.558 22.694 19.659 11.324 0.102 21.109-8.086 23.05-19.243 1.9412-11.157-4.5348-22.148-15.228-25.876-0.04-0.014-0.078-0.017-0.119-0.03z"
                      />
                    <path
                          id="path1748"
                          style={{strokeLineJoin:'round',stroke:inface.acolor2,strokeLineCap:'round',strokeWidth:'12.5',fill:'none'}}
                          transform="translate(50 5.1993e-7)"
                          d="m-19.999 6.8746v24.511"
                      />
                    <path
                          id="path696"
                          style={{fillRule:'evenodd',fill:'#000000'}}
                          transform="matrix(.95176 0 0 .95176 1.448 1.5234)"
                          d="m37.875 10.719v8.219c6.368 3.37 9.988 10.454 8.719 17.75-1.419 8.156-8.472 14.011-16.75 13.937-8.279-0.074-15.228-6.101-16.5-14.281-1.124-7.228 2.496-14.194 8.781-17.5v-8.094c-8.321 2.854-14.296 9.88-16 18.125-0.5746 2.781-0.6446 5.686-0.1875 8.625 1.8285 11.757 11.946 20.549 23.844 20.656 11.897 0.107 22.179-8.496 24.218-20.218 2.039-11.723-4.765-23.27-16-27.188-0.042-0.015-0.082-0.018-0.125-0.031z"
                      />
                    <path
                          id="path701"
                          style={{strokeLineJoin:'round',stroke:'#000000',strokeLineCap:'round',strokeWidth:'7.9794',fill:'none'}}
                          transform="matrix(.93992 0 0 .93992 1.776 3.8193)"
                          d="m30.029 3.2505v26.078"
                      />
                </symbol>
                <symbol id='optionsSVG'>
                    <path d="m80.16 29.054-5.958-.709 5.958.71Zm31.68 0-5.958.71 5.958-.71Zm34.217 19.756-2.365-5.515 2.365 5.514Zm10.081 3.352 5.196-3-5.196 3Zm7.896 13.676 5.196-3-5.196 3Zm-2.137 10.407-3.594-4.805 3.594 4.805Zm0 39.51 3.593-4.805-3.593 4.805Zm2.137 10.407 5.196 3-5.196-3Zm-7.896 13.676-5.196-3 5.196 3Zm-10.081 3.353 2.364-5.515-2.364 5.515Zm-34.217 19.755 5.958.709-5.958-.709Zm-31.68 0-5.958.709 5.958-.709Zm-34.217-19.755-2.364-5.515 2.364 5.515Zm-10.08-3.353-5.197 3 5.196-3Zm-7.897-13.676 5.196-3-5.196 3Zm2.137-10.407 3.594 4.805-3.594-4.805Zm0-39.51L26.51 81.05l3.593-4.805Zm-2.137-10.407 5.196 3-5.196-3Zm7.896-13.676-5.196-3 5.196 3Zm10.081-3.352-2.364 5.514 2.364-5.514Zm7.85 3.365-2.365 5.515 2.364-5.515Zm0 87.65 2.364 5.514-2.365-5.514ZM36.235 111.17l-3.594-4.805 3.594 4.805Zm76.823 41.535 5.958.71-5.958-.71Zm39.854-69.742-3.593-4.805 3.593 4.805Zm-16.369-30.074 2.364 5.514-2.364-5.514Zm-23.485-13.594-5.958.709 5.958-.71ZM88.104 16a14 14 0 0 0-13.902 12.345l11.916 1.419A2 2 0 0 1 88.104 28V16Zm15.792 0H88.104v12h15.792V16Zm13.902 12.345A14 14 0 0 0 103.896 16v12a2 2 0 0 1 1.986 1.764l11.916-1.419Zm1.219 10.24-1.219-10.24-11.916 1.419 1.219 10.24 11.916-1.419Zm24.675 4.71-9.513 4.08 4.729 11.028 9.513-4.08-4.729-11.028Zm17.642 5.867a14 14 0 0 0-17.642-5.867l4.729 11.029a2 2 0 0 1 2.521.838l10.392-6Zm7.896 13.676-7.896-13.676-10.392 6 7.896 13.676 10.392-6Zm-3.74 18.212a14 14 0 0 0 3.74-18.212l-10.392 6a2 2 0 0 1-.535 2.602l7.187 9.61Zm-8.984 6.718 8.984-6.718-7.187-9.61-8.983 6.718 7.186 9.61Zm8.984 23.182-8.984-6.718-7.186 9.61 8.983 6.718 7.187-9.61Zm3.74 18.212a14 14 0 0 0-3.74-18.212l-7.187 9.61a2 2 0 0 1 .535 2.602l10.392 6Zm-7.896 13.676 7.896-13.676-10.392-6-7.896 13.676 10.392 6Zm-17.642 5.867a14 14 0 0 0 17.642-5.867l-10.392-6a2.001 2.001 0 0 1-2.521.838l-4.729 11.029Zm-9.513-4.08 9.513 4.08 4.729-11.029-9.512-4.079-4.73 11.028Zm-16.381 19.03 1.219-10.24-11.916-1.419-1.219 10.24 11.916 1.419ZM103.896 176a14 14 0 0 0 13.902-12.345l-11.916-1.419a2 2 0 0 1-1.986 1.764v12Zm-15.792 0h15.792v-12H88.104v12Zm-13.902-12.345A14 14 0 0 0 88.104 176v-12a2 2 0 0 1-1.986-1.764l-11.916 1.419Zm-1.012-8.504 1.012 8.504 11.916-1.419-1.012-8.504-11.916 1.419ZM51.428 134.31l-7.85 3.366 4.73 11.029 7.849-3.366-4.73-11.029Zm-7.85 3.366a2 2 0 0 1-2.52-.838l-10.392 6a14 14 0 0 0 17.642 5.867l-4.73-11.029Zm-2.52-.838-7.896-13.676-10.392 6 7.896 13.676 10.392-6Zm-7.896-13.676a2 2 0 0 1 .535-2.602l-7.187-9.61a14 14 0 0 0-3.74 18.212l10.392-6Zm.535-2.602 6.132-4.585-7.187-9.61-6.132 4.585 7.187 9.61ZM26.51 81.05l6.132 4.586 7.187-9.61-6.132-4.586-7.187 9.61Zm-3.74-18.212a14 14 0 0 0 3.74 18.212l7.187-9.61a2 2 0 0 1-.535-2.602l-10.392-6Zm7.896-13.676L22.77 62.838l10.392 6 7.896-13.676-10.392-6Zm17.642-5.867a14 14 0 0 0-17.642 5.867l10.392 6a2 2 0 0 1 2.52-.838l4.73-11.029Zm7.849 3.366-7.85-3.366-4.729 11.029 7.85 3.366 4.729-11.029Zm18.045-18.316-1.012 8.504 11.916 1.419 1.012-8.504-11.916-1.419Zm-1.754 27.552c6.078-3.426 11.69-9.502 12.658-17.63L73.19 36.85c-.382 3.209-2.769 6.415-6.635 8.595l5.893 10.453Zm-21.02 1.793c7.284 3.124 15.055 1.57 21.02-1.793l-5.893-10.453c-3.704 2.088-7.481 2.468-10.398 1.217l-4.73 11.029ZM49 96c0-7.1-2.548-15.022-9.171-19.975l-7.187 9.61C35.36 87.668 37 91.438 37 96h12Zm23.448 40.103c-5.965-3.363-13.736-4.917-21.02-1.793l4.729 11.029c2.917-1.251 6.694-.871 10.398 1.218l5.893-10.454Zm-32.62-20.128C46.452 111.022 49 103.1 49 96H37c0 4.563-1.64 8.333-4.358 10.365l7.187 9.61Zm78.679 19.575c-5.536 3.298-10.517 8.982-11.406 16.446l11.916 1.419c.329-2.765 2.318-5.582 5.632-7.557l-6.142-10.308Zm20.402-1.953c-7.094-3.042-14.669-1.463-20.402 1.953l6.142 10.308c3.382-2.015 6.872-2.372 9.53-1.233l4.73-11.028Zm-53.803 20.135c-.968-8.127-6.58-14.202-12.658-17.629l-5.893 10.454c3.866 2.179 6.253 5.385 6.635 8.594l11.916-1.419ZM141 96c0 6.389 2.398 13.414 8.32 17.842l7.186-9.61C154.374 102.638 153 99.668 153 96h-12Zm8.32-17.842C143.398 82.586 141 89.61 141 96h12c0-3.668 1.374-6.638 3.506-8.232l-7.186-9.61ZM118.507 56.45c5.733 3.416 13.308 4.995 20.401 1.953l-4.729-11.029c-2.658 1.14-6.148.782-9.53-1.233l-6.142 10.31Zm-11.406-16.446c.889 7.464 5.87 13.148 11.406 16.446l6.142-10.309c-3.314-1.974-5.303-4.79-5.632-7.556l-11.916 1.419Z"/><path stroke="#00000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" d="M96 120c13.255 0 24-10.745 24-24s-10.745-24-24-24-24 10.745-24 24 10.745 24 24 24Z"/>
                </symbol>
                <symbol id='dotsSVG'>
                    <path d="M4 9.5C5.38071 9.5 6.5 10.6193 6.5 12C6.5 13.3807 5.38071 14.5 4 14.5C2.61929 14.5 1.5 13.3807 1.5 12C1.5 10.6193 2.61929 9.5 4 9.5Z"/>
                    <path d="M12 9.5C13.3807 9.5 14.5 10.6193 14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5Z"/>
                    <path d="M22.5 12C22.5 10.6193 21.3807 9.5 20 9.5C18.6193 9.5 17.5 10.6193 17.5 12C17.5 13.3807 18.6193 14.5 20 14.5C21.3807 14.5 22.5 13.3807 22.5 12Z"/>
                </symbol>
                <symbol id='monitorSVG'>
                    <path d="M8 21H16M12 17V21M6.8 17H17.2C18.8802 17 19.7202 17 20.362 16.673C20.9265 16.3854 21.3854 15.9265 21.673 15.362C22 14.7202 22 13.8802 22 12.2V7.8C22 6.11984 22 5.27976 21.673 4.63803C21.3854 4.07354 20.9265 3.6146 20.362 3.32698C19.7202 3 18.8802 3 17.2 3H6.8C5.11984 3 4.27976 3 3.63803 3.32698C3.07354 3.6146 2.6146 4.07354 2.32698 4.63803C2 5.27976 2 6.11984 2 7.8V12.2C2 13.8802 2 14.7202 2.32698 15.362C2.6146 15.9265 3.07354 16.3854 3.63803 16.673C4.27976 17 5.11984 17 6.8 17Z" fill='none' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </symbol>
                <symbol id='smartphoneSVG'>
                    <path d="M12 18.01V18M8 3H16C17.1046 3 18 3.89543 18 5V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V5C6 3.89543 6.89543 3 8 3Z" fill='none' strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </symbol>
                <symbol id='upSVG'>
                    <polygon points="22.3,18.5 12,8.2 1.7,18.5 0.3,17.1 12,5.4 23.7,17.1 		"/>
                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
                <symbol >

                </symbol>
            </svg>
        </BrowserRouter>
    );
});

export default App;
