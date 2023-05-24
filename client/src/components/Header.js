import React, {useContext} from "react";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
const block =  observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const logOut = ()=>{
        user.setUser({})
        user.setIsAuth(false)
        window.localStorage.removeItem('token')
    }
    return(
        <div style={{color:'white',placeItems:'center',display:'grid',gridTemplateColumns:'1fr 1fr',background:"#525252",width:'100%',height:'80px',marginBottom:'70px'}}>
            <span style={{fontSize:'1.3em'}}>MYBLOG.NET</span>
            {user.isAuth?
                <span>{user.user.username}<span onClick={()=>logOut()} style={{marginLeft:'10px',color:'red',cursor:'pointer'}}>Выход</span></span>
            :
                <span onClick={()=>navigate('/login')} style={{cursor:'pointer'}}>Вход / Регистрация</span>
            }
        </div>
    )
})
export default block;