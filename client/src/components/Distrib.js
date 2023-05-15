import React, {useContext, useEffect,useState,useRef} from 'react';
import {observer} from "mobx-react-lite";
import {ADMIN_ROUTE} from "../utils/consts";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
//import Video from "./Video"
import Slider from "./Slider"
import Calculator from "./Calculator"
import Quiz from "./Quiz"
import Container from "./Container"
import Form from "./Form"
import Copy from "./Copy"
import {setBAttr,deleteBlock,changeSite} from "../http/API"
import LazyImage from "./LazyImage";
import ListOfProducts from "./ListOfProducts"
import Product from "./Product"

const Distributor = observer((data) => {
    const {inface,user} = useContext(Context)
    data = data.data
    function output(){
        if(((inface.mobile && JSON.parse(data.obj || "{}").mobileShow) || (!inface.mobile && JSON.parse(data.obj || "{}").pcShow)) || (user.role > 0 && document.location.pathname.includes(ADMIN_ROUTE))){
            if(data.type==='Контейнер'){return <Container data={data}/>}
            else if(data.type==='HTML блок'){return <div dangerouslySetInnerHTML={{__html:JSON.parse(data.obj || '{}').html}} />}
            else if(data.type==='Текст'){return <div className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){inface.setCurrText(data)}}} style={{width:'100%',}} dangerouslySetInnerHTML={{__html:JSON.parse(data.obj || '{}').text || ''}}/>}
            else if(data.type==='Форма'){return <Form data={data}/>}
            else if(data.type==='Квиз'){return <Quiz data={data}/>}
            else if(data.type==='Список товаров'){return <ListOfProducts data={data}/>}
            else if(data.type==='Товар'){return <Product data={data}/>}
            //else if(data.type==='Видео'){return <Video data={data}/>}
            else if(data.type==='Слайдер'){return <Slider data={data}/>}
            else if(data.type==='Калькулятор'){return <Calculator data={data}/>}
            else{return null}
        }else{return null}
    }
    const navigate = useNavigate()
    const block = useRef(0)
    const [h,setH] = useState(0)
    const [w,setW] = useState(0)
    if(JSON.parse(data.obj || "{}").background && JSON.parse(data.obj || "{}").background.length && document.getElementById('backgroundImage'+data.id) && h===0 && w===0){
        document.getElementById('backgroundImage'+data.id).onload = e=>{
            setH(document.getElementById('backgroundImage'+data.id).naturalHeight)
            setW(document.getElementById('backgroundImage'+data.id).naturalWidth)
        }
    }
    document.addEventListener('click',e=>{
        if(document.getElementById('blockProps'+data.id)){
            if(document.getElementById('blockProps'+data.id).style.display === 'grid' && user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){
                let cont = document.getElementById('blockProps'+data.id).getBoundingClientRect()
                if(window.getComputedStyle(document.getElementById('blockProps'+data.id)).getPropertyValue('opacity') === '1' && (!(e.pageX >= cont.left && e.pageX <= cont.right) || !(e.pageY >= cont.top && e.pageY <= cont.bottom))){
                    document.getElementById('blockProps'+data.id).style.display = 'none'
                }
            }
        }
    });
    let [stylesM,setStylesM] = useState(JSON.parse(data.obj || "{}").css || '')
    useEffect(()=>{
        let css = (JSON.parse(data.obj || "{}").css || '').trim().replace(/\n/g, "").replace(/\r/g, "")
        let cssM = (JSON.parse(data.obj || "{}").cssM || '').trim().replace(/\n/g, "").replace(/\r/g, "")
        if(css[css.length - 1] === ';'){css = css.substring(0, css.length - 1)}
        if(cssM[cssM.length - 1] === ';'){cssM = cssM.substring(0, cssM.length - 1)}
        let mStyles = {}
        css.split(';').filter(d=>{
            let arr = d.split(':')
            mStyles[arr[0]] = arr[1];
            return true
        })
        cssM.split(';').filter(d=>{
            let arr = d.split(':')
            mStyles[arr[0]] = arr[1];
            return true
        })
        let toCSS = '';
        for(let key in mStyles){toCSS = toCSS + key+':'+mStyles[key]+';\n'};
        setStylesM('')
        setStylesM(toCSS)
    },[JSON.stringify(data),data.obj])
    if(JSON.parse(data.obj || '{}').js && (!user.role > 0 || !document.location.pathname.includes(ADMIN_ROUTE))){
        try{window.eval(JSON.parse(data.obj || '{}').js)}catch(err){console.error('Ошибка во время исполнения кода: \n\n',err)}
    }
    if((JSON.parse(data.obj || "{}").pcShow && !inface.mobile) || (JSON.parse(data.obj || "{}").mobileShow && inface.mobile)){
    if(data.type==='Копия' && inface.blocks.filter(d=>d.id === parseInt(JSON.parse(data.obj || '{}').elementId))[0]){
        return <Copy data={data}/>
    }else{
    return(
        <div ref={block} id={'block'+data.id}
            onMouseOver={()=>{if(inface.moveblock !== 'block'+data.id && (!inface.moveblock.includes('block') || inface.blocks.filter(d=>d.id+'' === inface.moveblock.replace('block','')).length === 0 || (inface.moveblock === '' || (document.getElementById(inface.moveblock).offsetWidth > document.getElementById('block'+data.id).offsetWidth) || parseInt(inface.moveblock.replace('block','')) < data.id))){inface.setMoveblock('block'+data.id);}}}
            onMouseOut={e=>{let rect = document.getElementById('block'+data.id).getBoundingClientRect();if(inface.moveblock === 'block'+data.id && !data.parent.includes('page') && (e.pageX < rect.left || e.pageX > rect.right || e.pageY < rect.top || e.pageY > rect.bottom)){inface.setMoveblock(data.parent);}}} onClick={()=>{
                if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){}else{
                    if((JSON.parse(data.obj || '{}').href || '').includes('http')){
                        window.open(JSON.parse(data.obj || '{}').href, '_blank')
                    }else if((JSON.parse(data.obj || '{}').innerLink || 'Нет') === 'Нет'){
                        //
                    }else{
                        if(JSON.parse(data.obj || '{}').innerLink.includes('страница')){
                        navigate('/'+inface.pages.filter(p=>p.id === parseInt(JSON.parse(data.obj || '{}').innerLink.split('_')[1]))[0].path)
                        }else{
                        let el = document.querySelector('#block'+JSON.parse(data.obj || '{}').innerLink.split('_')[1]);
                        el.scrollIntoView({block:"start",behavior:'smooth'})
                        }
                    }
            }}} style={inface.currSettings && inface.currSettings.id && inface.currSettings.id === data.id?{border:'2px '+inface.acolor2+' dashed'}:{transitionProperty:'transform,opacity',}} className={!(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)) && ((JSON.parse(data.obj || '{}').href || '').includes('http') || (JSON.parse(data.obj || '{}').innerLink || 'Нет') !== 'Нет')?JSON.parse(data.obj || "{}").anim === 'true'?'FDAStart block hoverLink':'FDAEnd block hoverLink':JSON.parse(data.obj || "{}").anim === 'true'?'FDAStart block':'FDAEnd block'}>
            <style>
                #block{data.id}{'{'}
                {inface.mobile?stylesM:user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?JSON.parse(data.obj || "{}").css.replace(/position:fixed;/g,'position:relative;') || '':JSON.parse(data.obj || "{}").css || ''}
                {'}'}
            </style>
            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<div style={{display:inface.moveblock === 'block' + data.id?'grid':'none',zIndex:'1000',transitionDuration:'0.35s',top:'5px',left:'5px',background:inface.acolor,padding:'10px 12px',borderRadius:"10px",position:'absolute',gridAutoFlow:'column',gridGap:'1em'}}>
                <svg onClick={()=>{document.getElementById('blockSettings').style.display = 'block';document.getElementById('blockSettings').style.opacity = 1;inface.setCurrSettings(data);}} style={{stroke:'white',fill:'white',width:'1.6em',height:'1.6em',cursor:'pointer',}} viewBox="0 0 190 190" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#optionsSVG' ></use></svg>
                <svg onClick={e=>{if(inface.height - e.pageY > 200){document.getElementById('blockProps'+data.id).style.top = '45px';document.getElementById('blockProps'+data.id).style.bottom = 'auto';}else{document.getElementById('blockProps'+data.id).style.top = 'auto';document.getElementById('blockProps'+data.id).style.bottom = '45px';}if(e.pageX > inface.width * 0.66){document.getElementById('blockProps'+data.id).style.right = '0'}else{document.getElementById('blockProps'+data.id).style.left = '0px'};setTimeout(()=>{document.getElementById('blockProps'+data.id).style.display = 'grid'},50)}} style={{stroke:'white',fill:'white',width:'1.6em',height:'1.6em',cursor:'pointer',position:'relative'}} viewBox="0 1 23 23" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#dotsSVG' ></use></svg>
                <div id={'blockProps'+data.id} style={{display:'none',fontWeight:'bold',fontSize:"0.8em",gridGap:"1.3em",background:inface.acolor,top:'60px',color:'white',position:'absolute',zIndex:'1000',padding:'20px 20px',borderRadius:'10px',gridAutoFlow:'row'}}>
                    {data.type + ' ' + data.id}<br/>
                    <div style={{fontWeight:"400"}}>Видимость на устройствах:
                        <div style={{display:'grid',gridAutoFlow:'column',gridGap:'1em',marginTop:'10px'}}>
                            <svg onClick={()=>{let obj1 = JSON.parse(data.obj || "{}");obj1.pcShow = !obj1.pcShow;setBAttr('obj',JSON.stringify(obj1),data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{padding:'10px 40px',borderRadius:'10px',background:JSON.parse(data.obj || "{}").pcShow?'#ffffff35':'#ffffff00',stroke:'white',fill:'white',width:'1.6em',height:'1.6em',cursor:'pointer',}} viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#monitorSVG' ></use></svg>
                            <svg onClick={()=>{let obj1 = JSON.parse(data.obj || "{}");obj1.mobileShow = !obj1.mobileShow;setBAttr('obj',JSON.stringify(obj1),data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{padding:'10px 40px',borderRadius:'10px',background:JSON.parse(data.obj || "{}").mobileShow?'#ffffff35':'#ffffff00',stroke:'white',fill:'white',width:'1.6em',height:'1.6em',cursor:'pointer',}} viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#smartphoneSVG' ></use></svg>
                        </div>
                    </div>
                    <div onClick={()=>{let form = new FormData();form.append('id',data.id);form.append('title',prompt('Введите название для шаблона:'));changeSite('savePattern',form).then(data=>inface.setPatterns(data));}} style={{cursor:'pointer',}}>Сохранить шаблон</div>
                    <div style={{cursor:'pointer',}} onClick={()=>{if(data.priority > 0){setBAttr('priority','-',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}}}>Переместить выше</div>
                    <div style={{cursor:'pointer',}} onClick={()=>{if(data.priority < inface.blocks.length - 1){setBAttr('priority','+',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}}}>Переместить ниже</div>
                    <div onClick={()=>{if(window.confirm('Вы действительно хотите безвозвратно удалить этот блок?')){if(inface.currSettings && inface.currSettings.id === data.id){inface.setCurrSettings(null);document.getElementById('blockSettings').style.display = 'none';document.getElementById('blockSettings').style.opacity = 0;}inface.setMoveblock(data.parent);deleteBlock(data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}}} style={{cursor:'pointer',}}>Удалить</div>
                </div>
            </div>}
            {data.type !== 'Картинка' && data.type !== 'Товар'?JSON.parse(data.obj || "{}").background && JSON.parse(data.obj || "{}").background.length > 4 &&<div style={{position:'absolute',right:'0',top:'0',width:'100%',overflow:'hidden',height:'100%',zIndex:'0'}}>
                <LazyImage id={'backgroundImage'+data.id} style={{zIndex:'0',width:'100%',height:'100%',objectFit:'cover',objectPosition:'center'}} src={process.env.REACT_APP_API_URL + JSON.parse(data.obj || "{}").background} alt=''/>
                <div style={{position:'absolute',top:'0',left:'0',zIndex:'1',width:'100%',height:'100%',background:inface.width / inface.height > 0.82?((JSON.parse(data.obj || "{}").fBack || '#000000') + (JSON.parse(data.obj || "{}").fOpacity !== null?JSON.parse(data.obj || "{}").fOpacity * 255:0.5 * 255).toString(16).split('.')[0]):((JSON.parse(data.obj || "{}").fBackM || '#000000') + (JSON.parse(data.obj || "{}").fOpacityM !== null?JSON.parse(data.obj || "{}").fOpacityM * 255:0.5 * 255).toString(16).split('.')[0]),transitionDuration:'0.3s'}}></div>
            </div>:JSON.parse(data.obj || "{}").background && data.type !== 'Товар' && JSON.parse(data.obj || "{}").background.length > 4 &&<LazyImage id={'backgroundImage'+data.id} style={{width:'100%',height:'100%',objectFit:'contain',objectPosition:'center'}} src={process.env.REACT_APP_API_URL + JSON.parse(data.obj || "{}").background} alt=''/>}
            {output()}
            {(data.type==='Контейнер' || data.type==='Список товаров') && user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<div style={{position:'relative',width:'100%',height:'4px',display:inface.moveblock === 'block'+data.id && inface.blockType?'grid':'none',placeItems:'center',}}>
                <div style={{background:inface.acolor2 || inface.acolor2,width:'100%',height:'4px',top:'0',borderRadius:'4px'}}></div>
                <div style={{fontWeight:'bold',background:inface.acolor2 || inface.acolor2,color:'white',top:'-1fr',position:'absolute',borderRadius:'4px',padding:'0 8px'}}>Поместить сюда</div>
            </div>}
        </div>
    )}}else{return null}
})
export default Distributor;