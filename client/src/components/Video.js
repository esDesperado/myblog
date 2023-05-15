import React, {useContext,useState,useEffect,useRef} from 'react';
import {Context} from '../index';
import {NavLink,useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {auth} from "../http/API"
import {setBAttr,deleteBlock} from "../http/API"
import {ADMIN_ROUTE} from "../utils/consts";
import LazyImage from "./LazyImage";

const Video = observer((data,v) => {
    const {user,product,inface} = useContext(Context)
    data = data.data
    v = data.variation
    const navigate = useNavigate()

    const block = useRef(0)
    const [h,setH] = useState(0)
    const [w,setW] = useState(0)
    if(data.img3 && data.img3.length && h!==0 && w!==0){
        let img = new Image();
        img.src = process.env.REACT_APP_API_URL + data.img3
        img.onload = ()=>{
            setH(img.height)
            setW(img.width)
        }
        img.remove()
    }
    return(
    <div ref={block} id={'block'+data.id} className='block' style={{position:'relative'}}>
        <div style={{position:'absolute',left:'0',top:'0',minWidth:'100%',overflow:'hidden',display:'grid',height:'100%',zIndex:'0'}}>
            <LazyImage style={{placeSelf:'center',zIndex:'0',minWidth:'100%',minHeight:'100%',height:(block.current.offsetWidth / block.current.offsetHeight <= w / h)?'100%':'auto',width:(block.current.offsetWidth / block.current.offsetHeight <= w / h)?'auto':'100%',}} src={process.env.REACT_APP_API_URL + data.img3} alt=''/>
        </div>
        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<div style={{width:'100%',position:'relative',fontWeight:'bold',background:inface.aback,borderTop:'1px '+inface.acolor+' solid',color:inface.acolor,minHeight:'28px'}}>
            {!data.img3 || !data.img3.length?<div style={{overflow:'hidden',float:'left'}}>фон<input style={{width:'9em',}} onChange={e=>{setBAttr('img3',e.target.files[0],data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} type='file'/></div>:<div style={{float:'left',height:'20px',overflow:'hidden',}}>фон<svg onClick={()=>{setBAttr('img3','',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',width:'20px',height:'20px',marginRight:'10px',fill:inface.acolor,}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg></div>}
            <span style={{verticalAlign:'top'}}>фон</span><input defaultValue={data.background || inface.interface.background} onBlur={e=>{setBAttr('background',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} type='color'/>
            {data.background && data.background !== ''?<svg onClick={()=>{setBAttr('background','',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',top:'-6px',width:'20px',height:'20px',marginRight:'10px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>:null}
            <span style={{verticalAlign:'top'}}>текст</span><input defaultValue={data.color || inface.interface.color} onBlur={e=>{setBAttr('color',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} type='color'/>
            {data.color && data.color !== ''?<svg onClick={()=>{setBAttr('color','',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',top:'-6px',width:'20px',height:'20px',marginRight:'10px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>:null}
            <span style={{verticalAlign:'top'}}>прз.</span><input defaultValue={data.shadow?Math.round(parseInt(data.shadow, 16)/255*10)/10:'1'} onBlur={e=>{let hex;if(e.target.value > 1){hex = (255).toString(16).split('.')[0]}else if(e.target.value < 0.004){hex = '00'}else{hex = (e.target.value * 255).toString(16).split('.')[0]}if(hex.length < 2){hex = 0 + hex}setBAttr('shadow',hex,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor}} max='1' step='0.1' min='0' type='number'/>
            <span style={{verticalAlign:'top'}}>шир.</span><input id={'mapI'+data.id} onBlur={e=>{let hex;if(e.target.value > 100){hex = 100}else if(e.target.value < 1){hex = 1}else{hex = e.target.value}setBAttr('map',hex,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor}} max='100' step='1' min='1' type='number'/>
            <span style={{verticalAlign:'top'}}></span><select defaultValue={data.type} id={'typeI'+data.id} onChange={e=>{setBAttr('type',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',background:inface.aback,color:inface.acolor,marginRight:'0px'}}>
                {inface.typesList.map(d=><option>{d}</option>)}
            </select>
            <span style={{verticalAlign:'top'}}></span><select defaultValue={data.v} id={'varI'+data.id} onChange={e=>setBAttr('variation',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))} style={{fontWeight:'bold',verticalAlign:'top',background:inface.aback,color:inface.acolor,marginRight:'0px'}}>
                {inface.variationsList[data.type].map(d=><option>{d}</option>)}
            </select>
            <svg onClick={()=>{if(data.priority > 0){setBAttr('priority','-',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -30 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
            <svg onClick={()=>{if(data.priority < inface.blocks.length - 1){setBAttr('priority','+',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}}} style={{transform:'rotate(180deg)',verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -30 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
            <svg onClick={()=>{if(prompt('Введите "да" если вы действительно хотите безвозвратно удалить этот блок').toLowerCase() === 'да'){deleteBlock(data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',top:'3px',cursor:'pointer',width:'28px',height:'28px',marginRight:'7px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 596 596" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#deleteSVG' ></use></svg>
        </div>:null}
        <div className='block' style={{paddingBottom:'100px',paddingTop:inface.width > 600?'200px':'80px',position:'relative',display:'grid',gridTemplateColumns:'100%',justifyItems:'center',background:data.shadow?(data.background || inface.interface.background) + data.shadow:data.background || 'transparent',color:data.color || inface.interface.color,}}>
            <div style={{marginBottom:'10px',fontWeight:'600',textAlign:'center'}}>
                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<input onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){document.getElementById('text1'+'I'+data.id).style.display = 'block'}}} style={{display:'inline-block',fontWeight:'bold',background:inface.aback,color:inface.acolor,display:!data.text1 || !data.text1.length?'inline-block':'none'}} id={'text1'+'B'+data.id} value='заголовок' type='button'/>:null}
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
                {data.number && data.number.length?<iframe id='frameVideo' width='100%' height={inface.width > 600?inface.width * (parseInt(data.map || 100) / 100) / 16 * 9 + 'px':inface.width / 16 * 9 + 'px'} src={"https://www.youtube-nocookie.com/embed/" + data.number + "?mute=1&autoplay=1&modestbranding=1&color=white&enablejsapi=1&origin=" + /*window.location.hostname*/ "http://example.com"} frameBorder="0" allowFullScreen></iframe>:null}
                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?!data.number || !data.number.length?<div style={{width:'340px',maxWidth:'100%',display:'inline-block',overflow:'hidden',zIndex:'1'}}>id видео (строка после https://www.youtube.com/watch?v=)<input onChange={e=>{setBAttr('number',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} type='text'/></div>:<div style={{position:'absolute',right:'0',top:'-20px',width:'20px',overflow:'hidden',zIndex:'1'}}><svg onClick={()=>{setBAttr('number','',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',width:'20px',height:'20px',marginRight:'10px',fill:inface.acolor,zIndex:'4',overflow:'hidden',}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg></div>:null}
            </div>}
        </div>
    </div>
    );



    //return("Выберите вариацию postheader'a")

});


export default Video;