import React, {useContext,useState,useEffect,useRef} from 'react';
import {Context} from '../index';
import {observer} from "mobx-react-lite";
import {setBAttr,deleteBlock,deleteComponent,addComponent,setCAttr,mail} from "../http/API"
import {ADMIN_ROUTE} from "../utils/consts";
import LazyImage from "./LazyImage";

const Calculator = observer((data,v) => {
    const {user,inface} = useContext(Context)
    data = data.data
    v = data.variation
    const [calc,setCalc] = useState({})
    const [calcText,setCalcText] = useState('')
    const [addPrice,setAddPrice] = useState({})
    const [multiplier,setMultiplier] = useState({})
    const [price,setPrice] = useState(0)
    const [btnDisabled,setBtnDisabled] = useState(false)
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
    const [name,setName] = useState('')
    const [number,setNumber] = useState('')
    const [email,setEmail] = useState('')
    if(inface.components.length > 0 && JSON.stringify(calc).length === 2){
        let obj1 = addPrice
        let obj2 = calc
        let obj3 = multiplier
        inface.components.slice().sort((a,b)=>a.priority - b.priority).map((pr,key)=>{
            if(pr.type === data.id+'calcProp'){
                if(pr.price === 'checkbox' && !obj2[pr.title]){
                    inface.components.slice().sort((a,b)=>a.priority - b.priority).map((d,key)=>{
                        if(d.type === data.id+'pr'+pr.id && !obj2[pr.id]){
                            obj1[pr.id] = 0
                            obj2[pr.id] = []
                            obj3[pr.id] = 1
                        }
                        return true
                    })
                }
                if(pr.price === 'radio' && !obj2[pr.title]){
                    inface.components.slice().sort((a,b)=>a.priority - b.priority).map((d,key)=>{
                        if(d.type === data.id+'pr'+pr.id && !obj2[pr.id]){
                            obj2[pr.id] = d.id
                            if(d.price.includes('*')){
                                obj3[pr.id] = d.price?parseFloat(d.price.replace('*','')) > 0?parseFloat(d.price.replace('*','')):1:1
                                obj1[pr.id] = 0
                            }else{
                                obj3[pr.id] = 1
                                obj1[pr.id] = parseInt(d.price || 0)
                            }
                        }
                        return true
                    })
                }
                if(pr.price === 'select' && !obj2[pr.title]){
                    inface.components.slice().sort((a,b)=>a.priority - b.priority).map((d,key)=>{
                        if(d.type === data.id+'pr'+pr.id && !obj2[pr.id]){
                            obj2[pr.id] = d.id
                            if(d.price.includes('*')){
                                obj3[pr.id] = d.price?parseFloat(d.price.replace('*','')) > 0?parseFloat(d.price.replace('*','')):1:1
                                obj1[pr.id] = 0
                            }else{
                                obj3[pr.id] = 1
                                obj1[pr.id] = parseInt(d.price || 0)
                            }
                        }
                        return true
                    })
                }
            }
            return true
        })
        setCalc(obj2)
        setMultiplier(obj3)
        setAddPrice(obj1)
    }
    useEffect(()=>{
        let str1 = ''
        inface.components.slice().sort((a,b)=>a.priority - b.priority).map((pr,key)=>{
            if(pr.type === data.id+'calcProp' && calc[pr.id]){
                str1 += '<br/><b>' + pr.title + ':</b><br/>'
                inface.components.slice().sort((a,b)=>a.priority - b.priority).map((d,key)=>{
                    if(d.type === data.id+'pr'+pr.id){
                        if(pr.price === 'checkbox' && calc[pr.id].includes(d.id)){
                            str1 += '- '+d.title + '<br/>'
                        }else if(calc[pr.id] === d.id){
                            str1 += '- '+d.title + '<br/>'
                        }
                    }
                    return true
                })
            }
            return true
        })
        setCalcText(str1)
        const proiz = obj => Object.values(obj).length > 0 && Object.values(obj).reduce((a,b)=>a*b)
        const sum = obj => Object.values(obj).length > 0 && Object.values(obj).reduce((a,b)=>a+b)
        setPrice(Math.round(sum(addPrice) * proiz(multiplier)))
    },[calc,addPrice,data.id,inface.components,multiplier])
    return(
    <div ref={block} id={'block'+data.id} className='block' style={{overflow:'hidden',position:'relative'}}>
        <div style={{position:'absolute',left:'0',top:'0',minWidth:'100%',overflow:'hidden',display:'grid',height:'100%',zIndex:'0'}}>
            <LazyImage style={{placeSelf:'center',zIndex:'0',minWidth:'100%',minHeight:'100%',height:(block.current.offsetWidth / block.current.offsetHeight <= w / h)?'100%':'auto',width:(block.current.offsetWidth / block.current.offsetHeight <= w / h)?'auto':'100%',}} src={process.env.REACT_APP_API_URL + data.img3} alt=''/>
        </div>
        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<div style={{width:'100%',position:'relative',fontWeight:'bold',background:inface.aback,borderTop:'1px '+inface.acolor+' solid',color:inface.acolor,minHeight:'28px'}}>
            {!data.img3 || !data.img3.length?<div style={{overflow:'hidden',float:'left'}}>фон<input style={{width:'9em',}} onChange={e=>{setBAttr('img3',e.target.files[0],data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} type='file'/></div>:<div style={{float:'left',height:'20px',overflow:'hidden',}}>фон<svg onClick={()=>{setBAttr('img3','',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',width:'20px',height:'20px',marginRight:'10px',fill:inface.acolor,}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg></div>}
            <span style={{verticalAlign:'top'}}>фон</span><input defaultValue={data.background || inface.interface.background} onBlur={e=>{setBAttr('background',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} type='color'/>
            {data.background && data.background !== '' &&<svg onClick={()=>{setBAttr('background','',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',top:'-6px',width:'20px',height:'20px',marginRight:'10px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>}
            <span style={{verticalAlign:'top'}}>текст</span><input defaultValue={data.color || inface.interface.color} onBlur={e=>{setBAttr('color',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} type='color'/>
            {data.color && data.color !== '' &&<svg onClick={()=>{setBAttr('color','',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',top:'-6px',width:'20px',height:'20px',marginRight:'10px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>}
            <span style={{verticalAlign:'top'}}>прз.</span><input defaultValue={data.shadow?Math.round(parseInt(data.shadow, 16)/255*10)/10:'1'} onBlur={e=>{let hex;if(e.target.value > 1){hex = (255).toString(16).split('.')[0]}else if(e.target.value < 0.004){hex = '00'}else{hex = (e.target.value * 255).toString(16).split('.')[0]}if(hex.length < 2){hex = 0 + hex}setBAttr('shadow',hex,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor}} max='1' step='0.1' min='0' type='number'/>
            <span style={{verticalAlign:'top'}}></span><select defaultValue={data.type} id={'typeI'+data.id} onChange={e=>{setBAttr('type',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',background:inface.aback,color:inface.acolor,marginRight:'0px'}}>
                {inface.typesList.map(d=><option>{d}</option>)}
            </select>
            <span style={{verticalAlign:'top'}}></span><select defaultValue={data.v} id={'varI'+data.id} onChange={e=>setBAttr('variation',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))} style={{fontWeight:'bold',verticalAlign:'top',background:inface.aback,color:inface.acolor,marginRight:'0px'}}>
                {inface.variationsList[data.type].map(d=><option>{d}</option>)}
            </select>
            <span style={{verticalAlign:'top'}}>аним.</span><input onChange={e=>{let obj1 = JSON.parse(data.obj || "{}");obj1.anim = e.target.checked;setBAttr('obj',JSON.stringify(obj1),data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} defaultChecked={JSON.parse(data.obj || "{}").anim} style={{verticalAlign:'top',marginRight:'20px',marginTop:'7px'}} type='checkbox' />
            <svg onClick={()=>{if(data.priority > 0){setBAttr('priority','-',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -30 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
            <svg onClick={()=>{if(data.priority < inface.blocks.length - 1){setBAttr('priority','+',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}}} style={{transform:'rotate(180deg)',verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -30 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
            <svg onClick={()=>{if(prompt('Введите "да" если вы действительно хотите безвозвратно удалить этот блок').toLowerCase() === 'да'){deleteBlock(data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',top:'3px',cursor:'pointer',width:'28px',height:'28px',marginRight:'7px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 596 596" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#deleteSVG' ></use></svg>
        </div>}
        <div style={{padding:'80px 7% 80px 7%',position:'relative',width:'86%',display:'grid',gridTemplateColumns:'1fr 1fr',background:data.shadow?(data.background || inface.interface.background) + data.shadow:data.background || 'transparent',color:data.color || inface.interface.color,}}>
            <div className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} style={{gridColumn:'1/3',fontSize:'1em',textAlign:'center',marginBottom:inface.width > 1000?'30px':'20px',fontWeight:'500',position:'relative'}}>
                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input onClick={()=>document.getElementById('titleI'+data.id).style.display = 'block'} style={{fontWeight:'bold',background:inface.aback,color:inface.acolor,padding:'10px 30px',display:!data.title || !data.title.length?'inline-block':'none'}} id={'titleB'+data.id} value='Заголовок' type='button'/>}
                <span onClick={()=>{if(user.role > 3){document.getElementById('titleI'+data.id).style.display = 'block'}}} style={{fontSize:inface.width > 1000?'2.5em':'1.5em',margin:'0',cursor:'default',}} dangerouslySetInnerHTML={{__html:data.title}}/>
                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<textarea rows='1' onBlur={e=>{document.getElementById('titleI'+data.id).style.display = 'none';setBAttr('title',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} id={'titleI'+data.id}  style={{fontWeight:'bold',display:'none',position:'absolute',bottom:'0px',color:inface.acolor,background:inface.aback,border:'1px '+inface.acolor+' solid',left:inface.width > 400?'calc(50% - 300px)':'0',width:'600px',maxWidth:'100%',fontSize:'1.5em'}}/>}
            </div>
            <div className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} id={'calculator'+data.id} style={{display:'grid',gridTemplateColumns:inface.width > 1000?'50% 50%':'100%',width:'88%',background:(data.color || inface.interface.color)+'11',border:'1px '+(data.color || inface.interface.color)+'22 solid',borderRadius:'10px',gridColumn:'1/3',padding:'6%',}}>
                <div style={{width:'100%',marginBottom:'15px'}}>
                    {inface.components.slice().sort((a,b)=>a.priority - b.priority).map((pr,key)=>pr.type === data.id+'calcProp' &&
                    <div style={{width:'100%',fontSize:inface.width > 1000?'1em':'0.9em',display:'inline-block',margin:inface.width > 1000?'0 0 5px 0px':user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?'0':'0 0px',position:'relative',}}>
                        <div onClick={()=>{if(calc.type !== pr.title && user.role === 0){if(inface.components.filter((a,key)=>a.type === data.id+'calcProp' && a.title === pr.title)[0].price.includes('*')){let obj1 = multiplier;obj1.type = parseFloat(inface.components.filter((a,key)=>a.type === data.id+'type' && a.title === pr.title)[0].price.replace('*',''));setMultiplier(obj1)}else{let obj1 = multiplier;if(obj1.type !== 1){obj1.type = 1;setMultiplier(obj1)}};let obj = JSON.parse(JSON.stringify(calc));obj.type = pr.title;setCalc(obj);}}} style={{position:'relative',width:'100%',overflow:'hidden',cursor:'pointer',marginBottom:'8px'}}>
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input onClick={()=>document.getElementById('titleCI'+pr.id).style.display = 'block'} style={{width:'100%',fontWeight:'bold',background:inface.aback,color:inface.acolor,padding:'0px 30px',marginBottom:'3px',display:!pr.title || !pr.title.length?'inline-block':'none'}} id={'titleCB'+pr.id} value='Название свойства' type='button'/>}
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input type='text' onBlur={e=>{document.getElementById('titleCI'+pr.id).style.display = 'none';setCAttr('title',e.target.value,data.id,pr.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} id={'titleCI'+pr.id}  style={{fontWeight:'400',display:'none',position:'absolute',top:'0',color:inface.acolor,background:inface.aback,border:'1px '+inface.acolor+' solid',left:'0',width:'400px',maxWidth:'100%',zIndex:'3',fontSize:'0.9em'}}/>}
                            <div style={{fontSize:'1.1em',fontWeight:'500',cursor:'default',display:'inline-block',textAlign:'left'}} onClick={()=>{if(user.role > 3){document.getElementById('titleCI'+pr.id).style.display = 'block'}}}>{pr.title}</div>
                        </div>
                        <div style={{position:'relative'}}>
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && <div style={{float:'left'}}>Тип: </div>}{user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && <select style={{float:'left',background:'transparent',color:data.color || inface.interface.color}} defaultValue={pr.price} onChange={e=>{setCAttr('price',e.target.value,data.id,pr.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}>
                                <option style={{color:'black'}}>Не выбрано</option>
                                <option style={{color:'black'}}>radio</option>
                                <option style={{color:'black'}}>checkbox</option>
                                <option style={{color:'black'}}>select</option>
                            </select>}
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<div style={{marginTop:inface.width > 600?'0px':'0'}}>
                                <svg onClick={()=>addComponent(data.id+'calcProp',pr.priority).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-30 -20 90 90" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#plusSVG' ></use></svg>
                                <svg onClick={()=>{if(pr.priority > 0){setCAttr('priority','-',data.id+'calcProp',pr.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -55 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
                                <svg onClick={()=>{if(pr.priority < inface.components.filter((d,key)=>d.type === data.id+'calcProp').length - 1){setCAttr('priority','+',data.id+'calcProp',pr.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{transform:'rotate(180deg)',verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -20 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
                                <svg onClick={()=>{if(prompt('Введите "да" если вы действительно хотите безвозвратно удалить этот блок').toLowerCase() === 'да'){deleteComponent(pr.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',top:'3px',cursor:'pointer',width:'28px',height:'28px',marginRight:'7px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 596 596" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#deleteSVG' ></use></svg>
                            </div>}
                        </div>
                        {user.role > 3 && inface.components.filter((d,key)=>d.type === data.id+'calcProp').length === 0 &&<div style={{fontSize:'1.2em',}}>
                            <div style={{width:'80px',position:'relative',padding:'0px 0',display:'inline-block',gridTemplateColumns:'100%',textAlign:'center'}}>
                                <svg onClick={()=>addComponent(data.id+'calcProp',0).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))} style={{cursor:'pointer',verticalAlign:'top',width:'30px',height:'30px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#plusSVG' ></use></svg>
                            </div>
                        </div>}
                        {pr.price === 'radio' && <div style={{width:'100%',marginBottom:'15px'}}>
                            {inface.components.slice().sort((a,b)=>a.priority - b.priority).map((d,key)=>d.type === data.id+'pr'+pr.id &&
                                <div style={{width:'100%',fontSize:inface.width > 1000?'1.1em':'1em',display:'inline-block',margin:inface.width > 1000?'0px':user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?'0':'0 0px',position:'relative',}}>
                                    <div onClick={()=>{if(calc[pr.id] !== d.id && (user.role === 0 || !document.location.pathname.includes(ADMIN_ROUTE))){let obj1 = multiplier;let obj2 = addPrice;if(d.price){if(d.price.includes('*')){obj1[pr.id] = parseFloat(d.price.replace('*',''));obj2[pr.id] = 0;}else{if(obj1[pr.id] !== 1){obj1[pr.id] = 1;};obj2[pr.id] = parseInt(d.price)}}else{if(obj1[pr.id] !== 1){obj1[pr.id] = 1;};obj2[pr.id] = 0};setMultiplier(obj1);setAddPrice(obj2);let obj = JSON.parse(JSON.stringify(calc));obj[pr.id] = d.id;setCalc(obj);}}} style={{position:'relative',width:'100%',overflow:'hidden',cursor:'pointer'}}>
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input onClick={()=>document.getElementById('titleCI'+d.id).style.display = 'block'} style={{width:'100%',fontWeight:'bold',background:inface.aback,color:inface.acolor,padding:'0px 30px',marginBottom:'3px',display:!d.title || !d.title.length?'inline-block':'none'}} id={'titleCB'+d.id} value='Вариант' type='button'/>}
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input defaultValue={d.title} type='text' onBlur={e=>{document.getElementById('titleCI'+d.id).style.display = 'none';setCAttr('title',e.target.value,data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} id={'titleCI'+d.id}  style={{fontWeight:'400',display:'none',position:'absolute',top:'0',color:inface.acolor,background:inface.aback,border:'1px '+inface.acolor+' solid',left:'0',width:'400px',maxWidth:'100%',zIndex:'3',fontSize:'0.9em'}}/>}
                                        <div style={{float:'left',width:inface.width > 600?'0.6em':'0.7em',height:inface.width > 600?'0.6em':'0.7em',marginTop:'3px',border:inface.width > 600?calc[pr.id] === d.id?'3px '+inface.interface.main+' solid':'3px '+(data.color || inface.interface.color)+'55 solid':calc[pr.id] === d.id?'1px '+inface.interface.main+' solid':'1px '+(data.color || inface.interface.color)+'55 solid',borderRadius:'50%',marginRight:'10px',padding:inface.width > 600?'3px':'2px',position:'relative'}}>{calc[pr.id] === d.id && <div style={{width:'100%',height:'100%',borderRadius:'50%',background:inface.interface.main}}></div>}</div>
                                        <div className='hoverOp' style={{padding:'4px 0',textDecoration:'none',color:data.color || inface.interface.color,width:'100%',cursor:'pointer'}} onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){document.getElementById('titleCI'+d.id).style.display = 'block'}}}>{d.title}</div>
                                    </div>
                                    <div style={{position:'relative'}}>
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input onClick={()=>document.getElementById('priceCI'+d.id).style.display = 'block'} style={{fontWeight:'bold',background:inface.aback,color:inface.acolor,padding:'0px 30px',marginBottom:'3px',display:!d.price || !d.price.length?'inline-block':'none'}} id={'priceCB'+d.id} value='Стоимость' type='button'/>}
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input defaultValue={d.price} type='text' onBlur={e=>{document.getElementById('priceCI'+d.id).style.display = 'none';setCAttr('price',e.target.value,data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} id={'priceCI'+d.id}  style={{fontWeight:'400',display:'none',position:'absolute',top:'0',color:inface.acolor,background:inface.aback,border:'1px '+inface.acolor+' solid',left:'0',width:'400px',maxWidth:'100%',zIndex:'3',fontSize:'0.9em'}}/>}
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && <div className='hoverOp' style={{textDecoration:'none',color:data.color || inface.interface.color,cursor:'pointer'}} onClick={()=>{if(user.role > 3){document.getElementById('priceCI'+d.id).style.display = 'block'}}}>{d.price}</div>}
                                    </div>
                                    {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<div style={{marginTop:inface.width > 600?'0px':'0'}}>
                                        <svg onClick={()=>addComponent(data.id+'pr'+pr.id,d.priority).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-30 -20 90 90" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#plusSVG' ></use></svg>
                                        <svg onClick={()=>{if(d.priority > 0){setCAttr('priority','-',data.id+'pr'+pr.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -55 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
                                        <svg onClick={()=>{if(d.priority < inface.components.filter((d,key)=>d.type === data.id+'pr'+pr.id).length - 1){setCAttr('priority','+',data.id+'pr'+pr.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{transform:'rotate(180deg)',verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -20 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
                                        <svg onClick={()=>{if(prompt('Введите "да" если вы действительно хотите безвозвратно удалить этот блок').toLowerCase() === 'да'){deleteComponent(d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',top:'3px',cursor:'pointer',width:'28px',height:'28px',marginRight:'7px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 596 596" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#deleteSVG' ></use></svg>
                                    </div>}

                                </div>
                            )}
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && inface.components.filter((d,key)=>d.type === data.id+'pr'+pr.id).length === 0 &&<div style={{fontSize:'1.2em',}}>
                                <div style={{width:'80px',position:'relative',padding:'0px 0',display:'inline-block',gridTemplateColumns:'100%',textAlign:'center'}}>
                                    <svg onClick={()=>addComponent(data.id+'pr'+pr.id,0).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))} style={{cursor:'pointer',verticalAlign:'top',width:'30px',height:'30px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#plusSVG' ></use></svg>
                                </div>
                            </div>}
                        </div>}
                        {pr.price === 'checkbox' && <div style={{width:'100%',marginBottom:'15px'}}>
                            {inface.components.slice().sort((a,b)=>a.priority - b.priority).map((d,key)=>d.type === data.id+'pr'+pr.id &&
                                <div style={{width:'100%',cursor:'pointer',fontSize:inface.width > 600?'1.1em':'1em',display:'inline-block',margin:inface.width > 600?'0 0px':user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?'0':'0 0px',position:'relative',}}>
                                    <div onClick={()=>{if(user.role === 0 || !document.location.pathname.includes(ADMIN_ROUTE)){let obj1 = JSON.parse(JSON.stringify(calc));let obj2 = JSON.parse(JSON.stringify(addPrice));let obj3 = JSON.parse(JSON.stringify(multiplier));if(obj1[pr.id]){if(!obj1[pr.id].includes(d.id)){if(d.price){if(d.price.includes('*')){obj3[pr.id] += parseFloat(d.price.replace('*','')) - 1;}else{obj2[pr.id] += parseInt(d.price)}}else{if(obj3[pr.id] !== 1){obj3[pr.id] = 1;};obj2[pr.id] = 0};;obj1[pr.id].push(d.id)}else{if(d.price.includes('*')){obj3[pr.id] -= parseFloat(d.price.replace('*','')) - 1}else{obj2[pr.id] -= parseInt(d.price)};obj1[pr.id] = obj1[pr.id].filter(da=>da !== d.id)}};setCalc(obj1);setAddPrice(obj2);setMultiplier(obj3);}}} style={{position:'relative',width:'100%',overflow:'hidden',cursor:'pointer',padding:'2px 0'}}>
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input onClick={()=>document.getElementById('titleCI'+d.id).style.display = 'block'} style={{width:'100%',fontWeight:'bold',background:inface.aback,color:inface.acolor,padding:'0px 30px',marginBottom:'3px',display:!d.title || !d.title.length?'inline-block':'none'}} id={'titleCB'+d.id} value='Название' type='button'/>}
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input defaultValue={d.title} type='text' onBlur={e=>{document.getElementById('titleCI'+d.id).style.display = 'none';setCAttr('title',e.target.value,data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} id={'titleCI'+d.id}  style={{fontWeight:'400',display:'none',position:'absolute',top:'0',color:inface.acolor,background:inface.aback,border:'1px '+inface.acolor+' solid',left:'0',width:'400px',maxWidth:'100%',zIndex:'3',fontSize:'0.9em'}}/>}
                                        <input checked={calc[pr.id] && calc[pr.id].includes(d.id)?true:false} style={{float:'left',width:inface.width > 600?'1.3em':'0.8em',height:inface.width > 600?'1.3em':'0.8em',marginTop:'2px',}} type='checkbox'/>
                                        <div className='hoverOp' style={{textDecoration:'none',color:data.color || inface.interface.color,width:'100%',cursor:'pointer'}} onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){document.getElementById('titleCI'+d.id).style.display = 'block'}}}>{d.title}</div>
                                    </div>
                                    <div style={{position:'relative'}}>
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input onClick={()=>document.getElementById('priceCI'+d.id).style.display = 'block'} style={{fontWeight:'bold',background:inface.aback,color:inface.acolor,padding:'0px 30px',marginBottom:'3px',display:!d.price || !d.price.length?'inline-block':'none'}} id={'priceCB'+d.id} value='Стоимость' type='button'/>}
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input defaultValue={d.price} type='text' onBlur={e=>{document.getElementById('priceCI'+d.id).style.display = 'none';setCAttr('price',e.target.value,data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} id={'priceCI'+d.id}  style={{fontWeight:'400',display:'none',position:'absolute',top:'0',color:inface.acolor,background:inface.aback,border:'1px '+inface.acolor+' solid',left:'0',width:'400px',maxWidth:'100%',zIndex:'3',fontSize:'0.9em'}}/>}
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && <div className='hoverOp' style={{textDecoration:'none',color:data.color || inface.interface.color,cursor:'pointer'}} onClick={()=>{if(user.role > 3){document.getElementById('priceCI'+d.id).style.display = 'block'}}}>{d.price}</div>}
                                    </div>
                                    {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<div style={{marginTop:inface.width > 600?'0px':'0'}}>
                                        <svg onClick={()=>addComponent(data.id+'pr'+pr.id,d.priority).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-30 -20 90 90" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#plusSVG' ></use></svg>
                                        <svg onClick={()=>{if(d.priority > 0){setCAttr('priority','-',data.id+'pr'+pr.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -55 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
                                        <svg onClick={()=>{if(d.priority < inface.components.filter((d,key)=>d.type === data.id+'pr'+pr.id).length - 1){setCAttr('priority','+',data.id+'pr'+pr.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{transform:'rotate(180deg)',verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -20 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
                                        <svg onClick={()=>{if(prompt('Введите "да" если вы действительно хотите безвозвратно удалить этот блок').toLowerCase() === 'да'){deleteComponent(d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',top:'3px',cursor:'pointer',width:'28px',height:'28px',marginRight:'7px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 596 596" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#deleteSVG' ></use></svg>
                                    </div>}

                                </div>
                            )}
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && inface.components.filter((d,key)=>d.type === data.id+'pr'+pr.id).length === 0 &&<div style={{fontSize:'1.2em',}}>
                                <div style={{width:'80px',position:'relative',padding:'0px 0',display:'inline-block',gridTemplateColumns:'100%',textAlign:'center'}}>
                                    <svg onClick={()=>addComponent(data.id+'pr'+pr.id,0).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))} style={{cursor:'pointer',verticalAlign:'top',width:'30px',height:'30px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#plusSVG' ></use></svg>
                                </div>
                            </div>}
                        </div>}
                        {pr.price === 'select' && <div style={{width:'100%',marginBottom:inface.width > 1000?'15px':'0px'}}>
                            {user.role !== 0 && document.location.pathname.includes(ADMIN_ROUTE)?inface.components.slice().sort((a,b)=>a.priority - b.priority).map((d,key)=>d.type === data.id+'pr'+pr.id &&
                                <div style={{width:'100%',fontSize:inface.width > 1000?'1em':'0.9em',display:'inline-block',margin:inface.width > 600?'0 0px':user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?'0':'0 0px',position:'relative',}}>
                                    <div style={{position:'relative',width:'100%',overflow:'hidden',cursor:'pointer'}}>
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input onClick={()=>document.getElementById('titleCI'+d.id).style.display = 'block'} style={{width:'100%',fontWeight:'bold',background:inface.aback,color:inface.acolor,padding:'0px 30px',marginBottom:'3px',display:!d.title || !d.title.length?'inline-block':'none'}} id={'titleCB'+d.id} value='Название' type='button'/>}
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input defaultValue={d.title} type='text' onBlur={e=>{document.getElementById('titleCI'+d.id).style.display = 'none';setCAttr('title',e.target.value,data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} id={'titleCI'+d.id}  style={{fontWeight:'400',display:'none',position:'absolute',top:'0',color:inface.acolor,background:inface.aback,border:'1px '+inface.acolor+' solid',left:'0',width:'400px',maxWidth:'100%',zIndex:'3',fontSize:'0.9em'}}/>}
                                        <div className='hoverOp' style={{textDecoration:'none',color:data.color || inface.interface.color,width:'100%',cursor:'pointer'}} onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){document.getElementById('titleCI'+d.id).style.display = 'block'}}}>{d.title}</div>
                                    </div>
                                    <div style={{position:'relative'}}>
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input onClick={()=>document.getElementById('priceCI'+d.id).style.display = 'block'} style={{fontWeight:'bold',background:inface.aback,color:inface.acolor,padding:'0px 30px',marginBottom:'3px',display:!d.price || !d.price.length?'inline-block':'none'}} id={'priceCB'+d.id} value='Стоимость' type='button'/>}
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input defaultValue={d.price} type='text' onBlur={e=>{document.getElementById('priceCI'+d.id).style.display = 'none';setCAttr('price',e.target.value,data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} id={'priceCI'+d.id}  style={{fontWeight:'400',display:'none',position:'absolute',top:'0',color:inface.acolor,background:inface.aback,border:'1px '+inface.acolor+' solid',left:'0',width:'400px',maxWidth:'100%',zIndex:'3',fontSize:'0.9em'}}/>}
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && <div className='hoverOp' style={{textDecoration:'none',color:data.color || inface.interface.color,cursor:'pointer'}} onClick={()=>{if(user.role > 3){document.getElementById('priceCI'+d.id).style.display = 'block'}}}>{d.price}</div>}
                                    </div>
                                    {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<div style={{marginTop:inface.width > 600?'0px':'0'}}>
                                        <svg onClick={()=>addComponent(data.id+'pr'+pr.id,d.priority).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-30 -20 90 90" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#plusSVG' ></use></svg>
                                        <svg onClick={()=>{if(d.priority > 0){setCAttr('priority','-',data.id+'pr'+pr.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -55 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
                                        <svg onClick={()=>{if(d.priority < inface.components.filter((d,key)=>d.type === data.id+'pr'+pr.id).length - 1){setCAttr('priority','+',data.id+'pr'+pr.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{transform:'rotate(180deg)',verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -20 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
                                        <svg onClick={()=>{if(prompt('Введите "да" если вы действительно хотите безвозвратно удалить этот блок').toLowerCase() === 'да'){deleteComponent(d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',top:'3px',cursor:'pointer',width:'28px',height:'28px',marginRight:'7px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 596 596" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#deleteSVG' ></use></svg>
                                    </div>}

                                </div>
                            ):<select style={{margin:'10px 0',fontSize:'1.1em',paddingBottom:'10px',cursor:'pointer',background:'transparent',border:'0',color:data.color || inface.interface.color,borderBottom:'1px '+(data.color || inface.interface.color)+' solid',width:'100%'}} onChange={e=>{let d = inface.components.filter((d,key)=>d.type === data.id+'pr'+pr.id && d.title === e.target.value)[0];let obj1 = multiplier;let obj2 = addPrice;if(d.price){if(d.price.includes('*')){obj1[pr.id] = parseFloat(d.price.replace('*',''));obj2[pr.id] = 0;}else{if(obj1[pr.id] !== 1){obj1[pr.id] = 1;};obj2[pr.id] = pr.price;}}else{if(obj1[pr.id] !== 1){obj1[pr.id] = 1;};obj2[pr.id] = 0};setMultiplier(obj1);setAddPrice(obj2);let obj = JSON.parse(JSON.stringify(calc));obj[pr.id] = d.id;setCalc(obj);}}>
                                {inface.components.slice().sort((a,b)=>a.priority - b.priority).map((d,key)=>d.type === data.id+'pr'+pr.id &&
                                <option style={{color:data.background || inface.interface.background,cursor:'pointer'}}>{d.title}</option>
                            )}</select>}
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && inface.components.filter((d,key)=>d.type === data.id+'pr'+pr.id).length === 0 &&<div style={{fontSize:'1.2em',}}>
                                <div style={{width:'80px',position:'relative',padding:'0px 0',display:'inline-block',gridTemplateColumns:'100%',textAlign:'center'}}>
                                    <svg onClick={()=>addComponent(data.id+'pr'+pr.id,0).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))} style={{cursor:'pointer',verticalAlign:'top',width:'30px',height:'30px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#plusSVG' ></use></svg>
                                </div>
                            </div>}
                        </div>}
                    </div>
                    )}
                </div>
                <div>
                    <div style={{margin:inface.width > 1000?'70px 0':'10px 0',position:'relative',cursor:'pointer'}} onClick={()=>{document.getElementById('FIOTXT'+data.id).style.color = '#FF2C3A';document.getElementById('FIOTXT'+data.id).style.transform = 'translateY(0em)';document.getElementById('FIO'+data.id).focus();}}
                    onBlur={()=>{if(document.getElementById('FIO'+data.id).value.trim().length === 0){document.getElementById('FIOHR1'+data.id).style.borderColor = '#FF2C3A';document.getElementById('FIOTXT'+data.id).style.transform = 'translateY(1.1em)';}else{document.getElementById('FIOTXT'+data.id).style.color = data.color || inface.interface.color;document.getElementById('FIOHR1'+data.id).style.borderColor = data.color || inface.interface.color;}}}
                    onMouseOver={()=>{document.getElementById('FIOHR'+data.id).style.transform = 'scaleX(100%)';}}
                    onMouseOut={()=>{document.getElementById('FIOHR'+data.id).style.transform = 'scaleX(0%)';}}>
                        <div id={'FIOTXT'+data.id} style={{transform:'translateY(1.1em)',transitionDuration:'0.2s'}}>ФИО *</div>
                        <input id={'FIO'+data.id} onChange={e=>setName(e.target.value)} value={name} style={{color:data.color || inface.interface.color,border:'none',background:'transparent',marginBottom:'3px',width:'100%'}}/>
                        <div style={{display:'grid',justifyItems:'center'}}>
                            <hr id={'FIOHR1'+data.id} style={{position:'absolute',borderColor:data.color || inface.interface.color,opacity:'1',width:'100%'}}/>
                            <hr id={'FIOHR'+data.id} style={{position:'absolute',width:'100%',transform:'scaleX(0%)',borderColor:data.background || inface.interface.background,transitionDuration:'.4s',opacity:'1'}}/>
                        </div>
                    </div>
                    <div style={{margin:inface.width > 1000?'70px 0':'10px 0',position:'relative',cursor:'pointer'}} onClick={()=>{document.getElementById('NUMTXT'+data.id).style.color = '#FF2C3A';document.getElementById('NUMTXT'+data.id).style.transform = 'translateY(0em)';document.getElementById('NUM'+data.id).focus();}}
                    onBlur={()=>{if(document.getElementById('NUM'+data.id).value.trim().length < 6){document.getElementById('NUMHR1'+data.id).style.borderColor = '#FF2C3A';document.getElementById('NUMTXT'+data.id).style.transform = 'translateY(1.1em)';}else{document.getElementById('NUMTXT'+data.id).style.color = data.color || inface.interface.color;document.getElementById('NUMHR1'+data.id).style.borderColor = data.color || inface.interface.color;}}}
                    onMouseOver={()=>{document.getElementById('NUMHR'+data.id).style.transform = 'scaleX(100%)';}}
                    onMouseOut={()=>{document.getElementById('NUMHR'+data.id).style.transform = 'scaleX(0%)';}}>
                        <div id={'NUMTXT'+data.id} style={{transform:'translateY(1.1em)',transitionDuration:'0.2s'}}>Номер телефона *</div>
                        <input id={'NUM'+data.id} onChange={e=>setNumber(e.target.value)} value={number} style={{color:data.color || inface.interface.color,border:'none',background:'transparent',marginBottom:'3px',width:'100%'}}/>
                        <div style={{display:'grid',justifyItems:'center'}}>
                            <hr id={'NUMHR1'+data.id} style={{position:'absolute',borderColor:data.color || inface.interface.color,opacity:'1',width:'100%'}}/>
                            <hr id={'NUMHR'+data.id} style={{position:'absolute',width:'100%',transform:'scaleX(0%)',borderColor:data.background || inface.interface.background,transitionDuration:'.4s',opacity:'1'}}/>
                        </div>
                    </div>
                    <div style={{margin:inface.width > 1000?'70px 0':'10px 0',marginBottom:inface.width < 1000 && '4em',position:'relative',cursor:'pointer'}} onClick={()=>{document.getElementById('EMAILTXT'+data.id).style.transform = 'translateY(0em)';document.getElementById('EMAIL'+data.id).focus();}}
                    onBlur={()=>{if(document.getElementById('EMAIL'+data.id).value.trim().length === 0){document.getElementById('EMAILTXT'+data.id).style.transform = 'translateY(1.1em)';}}}
                    onMouseOver={()=>{document.getElementById('EMAILHR'+data.id).style.transform = 'scaleX(100%)';}}
                    onMouseOut={()=>{document.getElementById('EMAILHR'+data.id).style.transform = 'scaleX(0%)';}}>
                        <div id={'EMAILTXT'+data.id} style={{transform:'translateY(1.1em)',transitionDuration:'0.2s'}}>Адрес электронной почты</div>
                        <input id={'EMAIL'+data.id} onChange={e=>setEmail(e.target.value)} value={email} style={{color:data.color || inface.interface.color,border:'none',background:'transparent',marginBottom:'3px',width:'100%'}}/>
                        <div style={{display:'grid',justifyItems:'center'}}>
                            <hr id={'EMAILHR1'+data.id} style={{position:'absolute',borderColor:data.color || inface.interface.color,opacity:'1',width:'100%'}}/>
                            <hr id={'EMAILHR'+data.id} style={{position:'absolute',width:'100%',transform:'scaleX(0%)',borderColor:data.background || inface.interface.background,transitionDuration:'.4s',opacity:'1'}}/>
                        </div>
                    </div>
                </div>
                <div style={{fontWeight:'500',fontSize:'1.4em',gridColumn:inface.width > 1000?'1/3':'1/2'}}>
                    <div style={{position:'relative',minWidth:'50%',textAlign:'left'}}>
                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input onClick={()=>document.getElementById('mapI'+data.id).style.display = 'block'} style={{fontWeight:'bold',position:'absolute',top:'-10px',background:inface.aback,color:inface.acolor,padding:'0 10px',display:!data.text3 || !data.text3.length?'inline-block':'none'}} id={'mapB'+data.id} value='стоимость' type='button'/>}
                        <div onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){document.getElementById('mapI'+data.id).style.display = 'block'}}} style={{fontSize:'0.8em',fontWeight:'500',padding:'0',}} dangerouslySetInnerHTML={{__html:data.map?data.map.replace(/\n/g, "<br/>"):''}}/>
                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<textarea rows='1' onBlur={e=>{document.getElementById('mapI'+data.id).style.display = 'none';setBAttr('map',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} id={'mapI'+data.id} style={{fontSize:'1em',fontWeight:'bold',top:'0px',display:'none',position:'absolute',color:inface.acolor,background:inface.aback,width:'100%',border:'1px '+inface.acolor+' solid',minWidth:'200px',}}/>}
                    </div>
                    <div style={{margin:'6px 0',}}>{price},00</div>
                    <hr style={{background:data.color || inface.interface.color,height:'1px',opacity:'1',width:'100%'}}/>
                    <button className='hoverOp' onClick={()=>{if(number.length > 5 && !btnDisabled){setBtnDisabled(true);let form = new FormData();form.append('priceList',calcText);form.append('price',price);form.append('number',number);form.append('email',email);form.append('name',name);mail('sendCalc',form).then(()=>{document.getElementById('calculator'+data.id).style.display = 'none';document.getElementById('hiddencalc'+data.id).style.display = 'grid';})}else{document.getElementById('NUMHR1'+data.id).style.background = '#FF2C3A';document.getElementById('NUMTXT'+data.id).style.color = '#FF2C3A';}}} style={{cursor:'pointer',margin:'1.5em 0 0.5em 0',border:'1px'+(data.color || inface.interface.color)+'33 solid',background:(data.color || inface.interface.color)+'11',color:data.color || inface.interface.color,padding:'10px 10px',borderRadius:'8px',fontSize:'1em'}}>Оставить заявку</button>
                </div>
            </div>
            <div id={'hiddencalc'+data.id} style={{fontSize:inface.width > 1000?'2.5em':'1.5em',display:'none',placeItems:'center',minHeight:inface.height * 0.85 + 'px',width:'100%',gridColumn:'1/3',transitionDuration:'1s'}}>
                <div style={{paddingBottom:'50px',textAlign:'center'}}>Заявка успешно отправлена!<br/>Наши менеджеры свяжутся с вами в ближайшее время!</div>
            </div>
        </div>


    </div>
    );//{(0 + addPrice + (calc.type && parseInt(inface.components.filter((d,key)=>d.type === data.id+'type' && d.title === calc.type)[0].price) || 0) + (calc.term && inface.components.filter((d,key)=>d.type === data.id+'term' && d.title === calc.term)[0].price.includes('*')?0:inface.components.filter((d,key)=>d.type === data.id+'term' && d.title === calc.term)[0] && parseInt(inface.components.filter((d,key)=>d.type === data.id+'term' && d.title === calc.term)[0].price) || 0)) * multiplier.term * multiplier.type * multiplier.add}



    //return("Выберите вариацию postheader'a")

});


export default Calculator;