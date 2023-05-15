/*




//////////////////  Код старый. Доработаю в будущем. Пока нет надобности. :D




import React, {useContext,useState} from 'react';
import {Context} from '../index';
import {observer} from "mobx-react-lite";
import {setBAttr} from "../http/API"
import {ADMIN_ROUTE} from "../utils/consts";
import LazyImage from "./LazyImage";
const Video = observer((data,v) => {
    const {user,inface} = useContext(Context)
    data = data.data
    v = data.variation
    return(
    <div id={'block'+data.id} className='block' style={{position:'relative'}}>
        <div style={{position:'absolute',left:'0',top:'0',width:'100%',overflow:'hidden',display:'grid',height:'100%',zIndex:'0'}}>
            <LazyImage style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}} src={process.env.REACT_APP_API_URL + data.img3} alt=''/>
        </div>
        <div className='block' style={{paddingBottom:'100px',paddingTop:inface.width > 600?'200px':'80px',position:'relative',display:'grid',gridTemplateColumns:'100%',justifyItems:'center',background:data.shadow?(data.background || inface.interface.background) + data.shadow:data.background || 'transparent',color:data.color || inface.interface.color,}}>
            <div style={{marginBottom:'10px',fontWeight:'600',textAlign:'center'}}>
                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<input onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){document.getElementById('text1'+'I'+data.id).style.display = 'block'}}} style={{display:'inline-block',fontWeight:'bold',background:inface.aback,color:inface.acolor,}} id={'text1'+'B'+data.id} value='заголовок' type='button'/>:null}
                <div onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){document.getElementById('text1'+'I'+data.id).style.display = 'block'}}} style={{fontSize:'2em',fontWeight:'600',cursor:'default',display:'inline-block'}} dangerouslySetInnerHTML={{__html:data.text1}}/>
                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<textarea rows='2' onBlur={e=>{document.getElementById('text1'+'I'+data.id).style.display = 'none';setBAttr('text1',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} id={'text1'+'I'+data.id} style={{width:'500px',maxWidth:'100%',position:'relative',fontSize:'2em',fontWeight:'600',display:'none',color:inface.acolor,background:inface.aback,border:'1px '+inface.acolor+' solid',}}/>:null}
            </div>
            <div style={{padding:inface.width > 600?'50px':'5px',marginBottom:'25px',position:'relative',textAlign:'center',display:'inline-block',maxWidth:inface.width > 1200?'1200px':'100%'}}>
                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<input onClick={()=>document.getElementById('text2'+'I'+data.id).style.display = 'block'} style={{fontWeight:'bold',background:inface.aback,color:inface.acolor,padding:'0 10px',display:!data.text2 || !data.text2.length?'inline-block':'none'}} id={'text2'+'B'+data.id} value='контент' type='button'/>:null}
                <div onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){document.getElementById('text2'+'I'+data.id).style.display = 'block'}}} style={{fontSize:'1.2em',cursor:'default',}} dangerouslySetInnerHTML={{__html:data.text2?data.text2?data.text2.replace(/\n/g, "<br/>"):'':''}}/>
                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<textarea rows='8' onBlur={e=>{document.getElementById('text2'+'I'+data.id).style.display = 'none';setBAttr('text2',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} id={'text2'+'I'+data.id} style={{zIndex:'3',fontSize:'1.2em',width:'100%',maxWidth:'100%',fontWeight:'bold',display:'none',color:inface.acolor,background:inface.aback,border:'1px '+inface.acolor+' solid',}}/>:null}
            </div>
            {v === 'с компьютера'?<div style={{marginBottom:inface.width > 600?'90px':'0px',textAlign:'center',display:'inline-block',width:inface.width > 600?(data.map || 100)+'%':'100%',position:'relative'}}>
                {data.video && data.video.length?<video style={{width:'100%'}} src={process.env.REACT_APP_API_URL + data.video} loop autoPlay controls muted></video>:null}
                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?!data.video || !data.video.length?<div style={{width:'140px',display:'inline-block',overflow:'hidden',zIndex:'1'}}><input onChange={e=>{setBAttr('video',e.target.files[0],data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} type='file'/></div>:<div style={{position:'absolute',right:'0',top:'-20px',width:'20px',overflow:'hidden',zIndex:'1'}}><svg onClick={()=>{setBAttr('video','',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',width:'20px',height:'20px',marginRight:'10px',fill:inface.acolor,zIndex:'4',overflow:'hidden',}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg></div>:null}
            </div>:
            <div style={{marginBottom:inface.width > 600?'90px':'0px',textAlign:'center',display:'inline-block',width:inface.width > 600?(data.map || 100)+'%':'100%',position:'relative'}}>
                {data.number && data.number.length?<iframe id='frameVideo' width='100%' height={inface.width > 600?inface.width * (parseInt(data.map || 100) / 100) / 16 * 9 + 'px':inface.width / 16 * 9 + 'px'} src={"https://www.youtube-nocookie.com/embed/" + data.number + "?mute=1&autoplay=1&modestbranding=1&color=white&enablejsapi=1&origin=" + "http://example.com"} frameBorder="0" allowFullScreen></iframe>:null}
                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?!data.number || !data.number.length?<div style={{width:'340px',maxWidth:'100%',display:'inline-block',overflow:'hidden',zIndex:'1'}}>id видео (строка после https://www.youtube.com/watch?v=)<input onChange={e=>{setBAttr('number',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} type='text'/></div>:<div style={{position:'absolute',right:'0',top:'-20px',width:'20px',overflow:'hidden',zIndex:'1'}}><svg onClick={()=>{setBAttr('number','',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',width:'20px',height:'20px',marginRight:'10px',fill:inface.acolor,zIndex:'4',overflow:'hidden',}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg></div>:null}
            </div>}
        </div>
    </div>
    );



    //return("Выберите вариацию postheader'a")

});


export default Video;
*/