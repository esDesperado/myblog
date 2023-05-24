import React, {useContext, useEffect,useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import jwt_decode from 'jwt-decode';
import {sendMail,checkCode,setUsername} from "../../http/API";
import Header from "../../components/Header"
import Footer from "../../components/Footer"
const Login = observer(() => {
    const {user,inface} = useContext(Context)
    const navigate = useNavigate()
    const [stage,setStage] = useState("sendMail")
    const [btnCond,setBtnCond] = useState(true)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    useEffect(()=>{
        if(user.isAuth){
            navigate('/')
        }
    },[document.location.pathname])
    return(
        <div style={{width:'100%',minHeight:window.innerHeight + 'px',position:'relative',display:'grid',placeItems:'center',overflow:'hidden'}}>
            {stage === 'sendMail' &&
                <form style={{maxWidth:inface.width + 'px',minHeight:'220px',textAlign:'center'}} className='logForm' onSubmit={e=> e.preventDefault()}>
                    <br/><b style={{fontSize:'1.3em'}}>Вход / Регистрация</b><br/><br/><br/>
                    <span style={{fontSize:'1.1em'}}>Введите Email</span><br/><br/>
                    <input style={{padding:'8px',width:'184px'}} onChange={e=>{setBtnCond(true);setEmail(e.target.value)}} value={email} className="pn-input" type="text"/><br/>
                    <button disabled={!(btnCond && email.length > 8 && email.includes("@"))} onClick={()=>{
                        console.log(btnCond)
                        if(btnCond){
                            setBtnCond(false);
                            sendMail(email).then(data=>{
                                setBtnCond(true);
                                setStage('checkCode')
                            })
                        }
                    }} className='logBtn'>Вход</button><br/>
                    <span style={{cursor:'pointer',textDecoration:'underline',color:'#1576FF'}} onClick={()=>{navigate("/")}}>На главную</span>
                </form>
            }
            {stage === 'checkCode' &&
                <form style={{maxWidth:inface.width + 'px',minHeight:'220px',textAlign:'center'}} className='logForm' onSubmit={e=> e.preventDefault()}>
                    <br/><b style={{fontSize:'1.3em'}}>Введите код подтверждения</b><br/><br/>
                    <span>Мы отправили код на {email}</span><br/><br/>
                    <input autoComplete="off" placeholder='например: 1234' style={{padding:'8px',marginTop:'15px',width:'184px'}} maxLength='6' onChange={e=>{
                        setCode(e.target.value);
                        if(e.target.value.length === 4){
                            checkCode(email,e.target.value).then(data=>{
                                if(data) {
                                    setBtnCond(true);
                                    user.setIsAuth(true)
                                    user.setUser(data)
                                    if (!data.name || !data.name.trim().length) {
                                        setStage('setName')
                                    } else {
                                        navigate('/')
                                    }
                                }
                            })
                        }
                    }} value={code} type="number" max="9999"/><br/>
                    <button disabled={!(btnCond && code.length === 4)} onClick={()=>{
                        checkCode(email,code).then(data=>{
                            if(data) {
                                setBtnCond(true);
                                user.setIsAuth(true)
                                user.setUser(data)
                                if (!data.name || !data.name.trim().length) {
                                    setStage('setName')
                                } else {
                                    navigate('/')
                                }
                            }
                        })
                    }} className='logBtn'>Подтвердить</button><br/>
                </form>
            }
            {stage === 'setName' &&
                <form style={{maxWidth:inface.width + 'px',minHeight:'220px',textAlign:'center'}} className='logForm' onSubmit={e=> e.preventDefault()}>
                    <br/><b style={{fontSize:'1.3em'}}>Регистрация</b><br/><br/><br/>
                    <span style={{fontSize:'1.1em'}}>Введите ваше имя</span><br/><br/>
                    <input style={{padding:'8px',width:'184px'}} onChange={e=>{setBtnCond(true);setName(e.target.value)}} value={name} className="pn-input" type="text"/><br/>
                    <button disabled={!(btnCond && name.length > 1)} onClick={()=>{
                        if(btnCond){
                            setBtnCond(false);
                            setUsername(name).then(data=>{
                                navigate('/')
                            })
                        }
                    }} className='logBtn'>Готово</button><br/>
                </form>
            }
        </div>
    );
});
export default Login;