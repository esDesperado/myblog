import React, {useContext,useState,useEffect,useRef,createRef} from 'react';
import {Context} from '../index';
import {observer} from "mobx-react-lite";
import {setBAttr,deleteBlock,deleteComponent,addComponent,setCAttr,sendQuiz} from "../http/API"
import {Editor} from '@tinymce/tinymce-react';
import {ADMIN_ROUTE} from "../utils/consts";
import LazyImage from "./LazyImage";
const Block = observer((data) => {
    const {user,inface} = useContext(Context)
    data = data.data
    const editorRef = useRef(inface.components.filter(d=>d.type===data.id+'').slice().sort((a,b)=>a.priority - b.priority).map((d,key)=>createRef()))
    const block = useRef(0)
    const [CL,setCL] = useState(0)
    const [h,setH] = useState(0)
    const [w,setW] = useState(0)
    const [question,setQuestion] = useState(0)
    const [btnD,setBtnD] = useState(true)
    const [quizEnd,setQuizEnd] = useState(localStorage.getItem('quizCond')?false:false)
    const [maxQ,setMaxQ] = useState(0)
    const [columns,setColumns] = useState(parseInt(JSON.parse(data.obj || "{}").columns) || 2)
    const [CW,setCW] = useState(parseInt(JSON.parse(data.obj || "{}").CW) || 500)
    const [quizObj,setQuizObj] = useState({})
    const [quizImg,setQuizImg] = useState(false)
    useEffect(()=>{
        let count = 0
        inface.components.map(d=>d.type === data.id+''?count++:null)
        setCL(count)
    },[inface.components,data.id])
    if(data.img3 && data.img3.length && h===0 && w===0){
        let img = new Image();
        img.src = process.env.REACT_APP_API_URL + data.img3
        img.onload = ()=>{
            setH(img.height)
            setW(img.width)
        }
        img.remove()
    }
    useEffect(()=>{
        if(CW !== JSON.parse(data.obj || "{}").CW){setCW(JSON.parse(data.obj || "{}").CW)}
        let clmns = inface.width < (parseInt(JSON.parse(data.obj || "{}").columns || 2) * parseInt(JSON.parse(data.obj || "{}").CW || 500)) / 1.2 ?1:parseInt(JSON.parse(data.obj || "{}").columns || 2) //Math.floor(inface.width / JSON.parse(data.obj || "{}").CW)
        if(columns !== clmns){setColumns(clmns);}
        /*
        if(columns !== clmns && clmns <= parseInt(JSON.parse(data.obj || "{}").columns || 2)){setColumns(clmns);}
        if(columns !== parseInt(JSON.parse(data.obj || "{}").columns || 2) && clmns > parseInt(JSON.parse(data.obj || "{}").columns || 2)){setColumns(parseInt(JSON.parse(data.obj || "{}").columns || 2));}
        */
    },[columns,JSON.parse(data.obj || "{}").columns,JSON.parse(data.obj || "{}").CW,inface.width])
    const [watchText,setWatchText] = useState({})
    return(
    <div ref={block} id={'block'+data.id} className='block' style={{background:data.shadow?(data.background || inface.interface.background) + data.shadow:data.background || 'transparent',position:'relative',display:'grid'}}>
        {data.img3 && data.img3.length > 4 &&<div style={{position:'absolute',left:'0',top:'0',minWidth:'100%',overflow:'hidden',display:'grid',height:'100%',zIndex:'0'}}>
            <LazyImage style={{placeSelf:'center',zIndex:'0',minWidth:'100%',minHeight:'100%',height:(block.current.offsetWidth / block.current.offsetHeight <= w / h)?'100%':'auto',width:(block.current.offsetWidth / block.current.offsetHeight <= w / h)?'auto':'100%',}} src={process.env.REACT_APP_API_URL + data.img3} alt=''/>
        </div>}
        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && <div style={{position:'relative',width:'100%',fontWeight:'bold',background:inface.aback,borderTop:'1px '+inface.acolor+' solid',color:inface.acolor,minHeight:'28px'}}>
            {!data.img3 || !data.img3.length?<div style={{overflow:'hidden',float:'left'}}>фон<input style={{width:'9em',}} onChange={e=>{setBAttr('img3',e.target.files[0],data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} type='file'/></div>:<div style={{float:'left',height:'20px',overflow:'hidden',}}>фон<svg onClick={()=>{setBAttr('img3','',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',width:'20px',height:'20px',marginRight:'10px',fill:inface.acolor,}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg></div>}
            <span style={{verticalAlign:'top'}}>фон</span><input defaultValue={data.background || inface.interface.background} onBlur={e=>{setBAttr('background',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} type='color'/>
            {data.background && data.background !== '' &&<svg onClick={()=>{setBAttr('background','',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',top:'-6px',width:'20px',height:'20px',marginRight:'10px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>}
            <span style={{verticalAlign:'top'}}>текст</span><input defaultValue={data.color || inface.interface.color} onBlur={e=>{setBAttr('color',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} type='color'/>
            {data.color && data.color !== '' &&<svg onClick={()=>{setBAttr('color','',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',top:'-6px',width:'20px',height:'20px',marginRight:'10px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>}
            <span style={{verticalAlign:'top'}}>прз.</span><input defaultValue={data.shadow || 1} onBlur={e=>{let hex;if(e.target.value > 1){hex = (255).toString(16).split('.')[0]}else if(e.target.value < 0.004){hex = '00'}else{hex = (e.target.value * 255).toString(16).split('.')[0]}if(hex.length < 2){hex = 0 + hex}setBAttr('shadow',hex,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor}} max='1' step='0.1' min='0' type='number'/>
            <span style={{verticalAlign:'top'}}></span><select defaultValue={data.type} id={'typeI'+data.id} onChange={e=>{setBAttr('type',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',background:inface.aback,color:inface.acolor,marginRight:'0px'}}>
                {inface.typesList.map(d=><option>{d}</option>)}
            </select>
            <span style={{verticalAlign:'top'}}></span><select defaultValue={data.v} id={'varI'+data.id} onChange={e=>setBAttr('variation',e.target.value,data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))} style={{fontWeight:'bold',verticalAlign:'top',background:inface.aback,color:inface.acolor,marginRight:'0px'}}>
                {inface.variationsList[data.type].map(d=><option>{d}</option>)}
            </select>
            <span style={{verticalAlign:'top'}}>столбцы:</span><input defaultValue={JSON.parse(data.obj || "{}").columns || 2} onBlur={e=>{let obj1 = JSON.parse(data.obj || "{}");obj1.columns = e.target.value;setBAttr('obj',JSON.stringify(obj1),data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} step='1' max='10000' min='1' type='number'/>
            <span style={{verticalAlign:'top'}}>ширина столбца</span><input defaultValue={JSON.parse(data.obj || "{}").CW || 'auto'} onBlur={e=>{let obj1 = JSON.parse(data.obj || "{}");obj1.CW = e.target.value;setBAttr('obj',JSON.stringify(obj1),data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} type='text'/>
            <span style={{verticalAlign:'top'}}>размер шрифта:</span><input defaultValue={JSON.parse(data.obj || "{}").fontSize || 1} onBlur={e=>{let obj1 = JSON.parse(data.obj || "{}");obj1.fontSize = e.target.value;setBAttr('obj',JSON.stringify(obj1),data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} step='0.1' max='99' min='1' type='number'/>
            <span style={{verticalAlign:'top'}}>отступы:
                в:<input defaultValue={JSON.parse(data.obj || "{}").vMargin || 10} onBlur={e=>{let obj1 = JSON.parse(data.obj || "{}");obj1.vMargin = e.target.value;setBAttr('obj',JSON.stringify(obj1),data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} step='10' max='9999' min='0' type='number'/>
                н:<input defaultValue={JSON.parse(data.obj || "{}").nMargin || 10} onBlur={e=>{let obj1 = JSON.parse(data.obj || "{}");obj1.nMargin = e.target.value;setBAttr('obj',JSON.stringify(obj1),data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} step='10' max='9999' min='0' type='number'/>
            </span>
            <span style={{verticalAlign:'top'}}>выс:<input defaultValue={JSON.parse(data.obj || "{}").height || 700} onBlur={e=>{let obj1 = JSON.parse(data.obj || "{}");obj1.height = e.target.value;setBAttr('obj',JSON.stringify(obj1),data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} type='text'/></span>
            <span style={{verticalAlign:'top'}}>аним.</span><input onChange={e=>{let obj1 = JSON.parse(data.obj || "{}");obj1.anim = e.target.checked;setBAttr('obj',JSON.stringify(obj1),data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}} defaultChecked={JSON.parse(data.obj || "{}").anim} style={{verticalAlign:'top',marginRight:'20px',marginTop:'7px'}} type='checkbox' />
            <svg onClick={()=>{if(data.priority > 0){setBAttr('priority','-',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -30 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
            <svg onClick={()=>{if(data.priority < inface.blocks.length - 1){setBAttr('priority','+',data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}}} style={{transform:'rotate(180deg)',verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -30 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
            <svg onClick={()=>{if(prompt('Введите "да" если вы действительно хотите безвозвратно удалить этот блок').toLowerCase() === 'да'){deleteBlock(data.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',top:'3px',cursor:'pointer',width:'28px',height:'28px',marginRight:'7px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 596 596" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#deleteSVG' ></use></svg>
        </div>}
        <div className='textDN' style={{marginTop:'20px',gridColumnGap:'4em',width:inface.width > 1100?'86%':'100%',alignItems:'start',position:'relative',padding:'20px',display:'grid',justifySelf:'center',gridTemplateColumns:inface.width > 1100?'repeat(3,1fr)':'1fr',color:data.color || inface.interface.color,}}>
            <div style={{position:'relative',width:'100%',fontSize:inface.width > 1100?(JSON.parse(data.obj || "{}").fontSize || 1)+'em':'0.7em',gridColumn:inface.width > 1100?'1/4':'1/2'}}>
                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && (!watchText || !data.text1 || !data.text1.trim().length)?<div style={{width:'100%'}}>
                    <Editor
                        apiKey='3hgh0lh5euqgmlarql66lcizcd26ho2bhecnji42flbhyoue'
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue={data.text1 || ''}
                        init={{
                        height: 400,
                        menubar: true,
                        plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'wordcount'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                        content_style: 'body {font-size:'+(JSON.parse(data.obj || "{}").fontSize || 1)+'em }'
                        }}
                    />
                    <button style={{color:inface.acolor,background:inface.aback,marginTop:'5px'}} onClick={()=>{if(editorRef.current){setBAttr('text1',editorRef.current.getContent(),data.id+'').then(d=>{inface.setBlocks(d)}).catch(d=>alert(d));setWatchText(true)}}}>Сохранить</button>
                </div>:
                <div>
                    <div className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){setWatchText(false)}}} style={{width:'100%',textAlign:'center'}} dangerouslySetInnerHTML={{__html:data.text1 || ''}}/>
                </div>}
            </div>
            {inface.components.filter(d=>d.type===data.id+'').slice().sort((a,b)=>a.priority - b.priority).map((d,key)=>{return(
            <div style={{gridColumn:(JSON.parse(d.obj || "{}").cType || 'тест') === 'тест'?inface.width > 1100?d.priority > 0?'2/4':'1/3':d.priority > 0?'3/4':'1/2':inface.width > 1100?'3/4':'1/2',gridRow:columns === 1?'auto':JSON.parse(d.obj || "{}").gr || 'auto',gridTemplateRows:user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?'3.5em 1fr':'1fr',width:'100%',display:(JSON.parse(d.obj || "{}").showMB || 'true') === 'true' || inface.width > 950?'grid':'none',justifyItems:'center',position:'relative',}}>
                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && <div style={{position:'relative',width:'100%',borderLeft:'3px '+inface.acolor+' solid',paddingTop:'7px',fontWeight:'bold',background:inface.aback,borderTop:'1px '+inface.acolor+' solid',color:inface.acolor,minHeight:'28px',}}>
                    <span style={{verticalAlign:'top'}}>тип:</span><select defaultValue={JSON.parse(d.obj || "{}").cType || 'текст'} onChange={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.cType = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',background:inface.aback,color:inface.acolor,marginRight:'0px'}}>
                        {['тест','сайдбар'].map(d=><option>{d}</option>)}
                    </select>
                    <span style={{verticalAlign:'top'}}>фон</span><input defaultValue={JSON.parse(d.obj || "{}").background || data.background || inface.interface.background} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.background = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} type='color'/>
                    <span style={{verticalAlign:'top'}}>текст</span><input defaultValue={JSON.parse(d.obj || "{}").color || data.color || inface.interface.color} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.color = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} type='color'/>

                    <span style={{verticalAlign:'top'}}>шир.</span><input defaultValue={JSON.parse(d.obj || "{}").width || 500} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.width = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,width:'3.5em'}} max='2000' step='10' min='200' type='text'/>
                    <span style={{verticalAlign:'top'}}>start/end</span> hor.<input defaultValue={JSON.parse(d.obj || "{}").gc || 'auto'} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.gc = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',width:'3em',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor}} type='text'/>
                    vert.<input defaultValue={JSON.parse(d.obj || "{}").gr || 'auto'} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.gr = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',width:'3em',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor}} type='text'/>
                    <span style={{verticalAlign:'top'}}>пок_в_МВ:</span><select defaultValue={JSON.parse(d.obj || "{}").showMB || 'true'} onChange={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.showMB = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}}><option>true</option><option>false</option></select>
                    <svg onClick={()=>addComponent(data.id+'',d.priority+1).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-30 -5 90 90" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#plusSVG' ></use></svg>
                    <svg onClick={()=>{if(d.priority > 0){setCAttr('priority','-',data.id+'',d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -20 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
                    <svg onClick={()=>{if(d.priority < CL - 1){setCAttr('priority','+',data.id+'',d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{transform:'rotate(180deg)',verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -50 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
                    <svg onClick={()=>{if(window.confirm('Вы действительно хотите безвозвратно удалить этот компонент?')){deleteComponent(d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',top:'1px',cursor:'pointer',width:'28px',height:'28px',marginRight:'7px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 596 596" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#deleteSVG' ></use></svg>
                </div>}
                <div style={{padding:inface.width > 1100?'15px 15px 15px 15px':'0',placeItems:'center',justifySelf:'center',margin:'0',width:'100%',borderRadius:'5px',maxWidth:'100%',position:'relative',display:'grid',gridTemplateColumns:'100%',}}>
                    {quizEnd && (JSON.parse(d.obj || "{}").cType || 'тест') === 'тест' && <div style={{letterSpacing:inface.width > 450?'0.3px':'1px',fontSize:inface.width > 1100?'1.3em':'1.2em',textAlign:'center',fontWeight:'400',borderRadius:'15px',padding:inface.width > 1100?'280px 40px':'140px 40px',width:'calc(100% - 120px)',height:inface.width > 1100?'calc(100% - 560px - 3em)':'calc(100% - 280px - 3em)',color:JSON.parse(d.obj || "{}").color || data.color || inface.interface.color,background:JSON.parse(d.obj || "{}").background || data.background || inface.interface.background,marginBottom:'3em',}}><b style={{fontSize:'1.6em',marginBottom:'10px',display:'inline-block'}}>Мы получили вашу заявку!</b><br/> Наши менеджеры свяжутся с вами в ближайшее время!</div>}
                    {!quizEnd && (JSON.parse(d.obj || "{}").cType || 'тест') === 'тест' &&<div style={{gridTemplateColumns:'100%',display:'grid',gridGap:inface.width > 1100?'2em':'1em',justifyItems:'center',padding:inface.width > 1100?'40px':'20px',width:inface.width > 1100?'calc(100% - 80px)':inface.width > 350?'calc(100% - 80px)':'calc(100% - 40px)',height:inface.width > 1100?'calc(100% - 80px - 3em)':'auto',marginBottom:'3em',color:JSON.parse(d.obj || "{}").color || data.color || inface.interface.color,background:JSON.parse(d.obj || "{}").background || data.background || inface.interface.background,fontSize:(JSON.parse(data.obj || "{}").fontSize || 1)+'em',borderRadius:'15px',overflow:'hidden'}}>
                        <div style={{width:'90%',background:'#F5F6F6',borderRadius:'30px',height:'40px',position:'relative',padding:'5px'}}>
                            <div style={{background:inface.interface.main,overflow:'hidden',borderRadius:'30px',width:(question) * (100 / (inface.components.filter(d=>d.type===data.id+'quiz').length - 1)) + '%',height:'100%',position:'relative'}}>
                                <div className='lines' style={{}} xmlns="http://www.w3.org/2000/svg"></div>
                            </div>
                            <div className='quizLoaded'>
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<input defaultValue={JSON.parse(d.obj || "{}").name || 'Расчёт'} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.name = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,width:'8em'}} type='text'/>
                            :<span>{JSON.parse(d.obj || "{}").name || 'Расчёт'}</span>} пройден на {(question) * (100 / (inface.components.filter(d=>d.type===data.id+'quiz').length - 1))}%</div>
                        </div>
                        {user.role > 3 && inface.components.filter(d=>d.type===data.id+'quiz').length === 0 && <div style={{color:inface.acolor,fontSize:'4em',cursor:'pointer',fontWeight:'bold'}} onClick={()=>addComponent(data.id+'quiz',0).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}>+</div>}
                        {inface.components.filter(d=>d.type===data.id+'quiz').slice().sort((a,b)=>a.priority - b.priority).map((d,key)=><div style={{maxWidth:'100%',display:question === d.priority?'block':'none'}}>
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && <div style={{position:'relative',width:'100%',borderLeft:'3px '+inface.acolor+' solid',paddingTop:'7px',fontWeight:'bold',background:inface.aback,borderTop:'1px '+inface.acolor+' solid',color:inface.acolor,minHeight:'28px',}}>
                                <span style={{verticalAlign:'top'}}>тип:</span><select defaultValue={JSON.parse(d.obj || "{}").cType || 'текст'} onChange={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.cType = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',background:inface.aback,color:inface.acolor,marginRight:'0px'}}>
                                    {['инпут','файл'].map(d=><option>{d}</option>)}
                                </select>
                                <span style={{verticalAlign:'top'}}>вопрос:</span><select value={question} onChange={e=>{setQuestion(parseInt(e.target.value));}} style={{fontWeight:'bold',verticalAlign:'top',background:inface.aback,color:inface.acolor,marginRight:'0px'}}>
                                    {inface.components.filter(d=>d.type===data.id+'quiz').slice().sort((a,b)=>a.priority - b.priority).map(d=><option>{d.priority}</option>)}
                                </select>
                                <span style={{verticalAlign:'top'}}>имя</span><input defaultValue={JSON.parse(d.obj || "{}").name || d.priority} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.name = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,width:'10em'}} type='text'/>
                                <span style={{verticalAlign:'top'}}>кол-во</span><input defaultValue={JSON.parse(d.obj || "{}").count || 1} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.count = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,width:'2em'}} max='9' min='0' type='number'/>
                                <span style={{verticalAlign:'top'}}>skip</span><input defaultChecked={JSON.parse(d.obj || "{}").skip} onChange={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.skip = e.target.checked;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{verticalAlign:'top',marginRight:'20px',marginTop:'7px'}} type='checkbox' />
                                <svg onClick={()=>addComponent(data.id+'quiz',d.priority+1).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-30 -5 90 90" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#plusSVG' ></use></svg>
                                <svg onClick={()=>{if(d.priority > 0){setCAttr('priority','-',data.id+'',d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -20 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
                                <svg onClick={()=>{if(d.priority < CL - 1){setCAttr('priority','+',data.id+'',d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{transform:'rotate(180deg)',verticalAlign:'top',cursor:'pointer',width:'28px',height:'28px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="-60 -50 260 260" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
                                <svg onClick={()=>{if(window.confirm('Вы действительно хотите безвозвратно удалить этот компонент?')){deleteComponent(d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}} style={{verticalAlign:'top',top:'1px',cursor:'pointer',width:'28px',height:'28px',marginRight:'7px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 596 596" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#deleteSVG' ></use></svg>
                            </div>}
                            <div style={{marginTop:'15px',display:'grid',alignItems:'center',gridAutoFlow:'column',gridGap:'2em'}}>
                                <b style={{justifySelf:'end',background:'#FEEA8C',padding:'10px 25px',borderRadius:'10px'}}>Вопрос {question + 1}</b>
                                <b style={{justifySelf:'start',fontSize:inface.width > 1100?'1.5em':'1.1em'}}>
                                    {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<input defaultValue={d.title || ''} onBlur={e=>{setCAttr('title',e.target.value,data.id+'',d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.6em',background:inface.aback,color:inface.acolor,width:'350px'}} type='text'/>
                                    :<div className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){let WT = JSON.parse(JSON.stringify(watchText));WT[d.id] = true;setWatchText(WT);}}} style={{width:'100%'}} dangerouslySetInnerHTML={{__html:d.title || ''}}/>}
                                </b>
                            </div>
                            <div style={{display:'grid',gridTemplateColumns:inface.width > 1100?'1fr 1fr':'100%',gridGap:'2em',minHeight:inface.width > 1100?'500px':'340px',alignItems:'center'}}>
                                {(JSON.parse(d.obj || "{}").cType || 'текст') === 'текст' && <div style={{display:'grid',justifyItems:'center',gridTemplateColumns:'100%',textAlign:'center',}}>
                                    {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && (watchText[d.id] || !data.description || !data.description.trim().length)?<div style={{}}>
                                        <Editor
                                            apiKey='3hgh0lh5euqgmlarql66lcizcd26ho2bhecnji42flbhyoue'
                                            onInit={(evt, editor) => editorRef.current[key] = editor}
                                            initialValue={d.description || ''}
                                            init={{
                                            height: 200,
                                            menubar: true,
                                            plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                            content_style: 'body {font-size:'+(JSON.parse(data.obj || "{}").fontSize || 1)+'em }'
                                            }}
                                        />
                                        <button style={{color:inface.acolor,background:inface.aback,marginTop:'5px'}} onClick={()=>{console.log(watchText);if(editorRef.current[key]){let WT = JSON.parse(JSON.stringify(watchText));WT[d.id] = false;setWatchText(WT);setCAttr('description',editorRef.current[key].getContent(),data.id+'quiz',d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}}>Сохранить</button>
                                    </div>:<div className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){let WT = JSON.parse(JSON.stringify(watchText));WT[d.id] = true;setWatchText(WT);}}} style={{width:'100%',maxWidth:'calc(100% - 40px)'}} dangerouslySetInnerHTML={{__html:d.description || ''}}/>}
                                    {[1,1,1,1,1,1,1,1,1].map((m,i)=>i <= (JSON.parse(d.obj || "{}").count || 1) - 1 && <div>
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input defaultValue={JSON.parse(d.obj || "{}")['PH'+i] || ''} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1['PH'+i] = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'1em',background:inface.aback,color:inface.acolor,width:'350px'}} type='text'/>}
                                        <input onBlur={e=>{let obj1 = JSON.parse(JSON.stringify(quizObj));obj1[JSON.parse(d.obj || "{}")['PH'+i]] = e.target.value;setQuizObj(obj1)}} onChange={e=>setBtnD(e.target.value.trim().length > 0?false:true)} style={{width:'12em',margin:'7px 0',minWidth:(JSON.parse(d.obj || "{}")['PH'+i] || '').length * 8.8 + 'px',maxWidth:'calc(100% - 40px)',padding:'25px 20px',border:'1px #D3D5D5 solid'}} placeholder={JSON.parse(d.obj || "{}")['PH'+i] || ''} type="text"/>
                                    </div>)}
                                    <br/>{question < inface.components.filter(d=>d.type===data.id+'quiz').length - 1 && JSON.parse(d.obj || "{}").skip && <button onClick={()=>{if(question < inface.components.filter(d=>d.type===data.id+'quiz').length - 1){setQuestion(question + 1)}}} style={{background:'transparent',border:'none',textDecoration:'underline',cursor:'pointer'}}>Пропустить вопрос</button>}
                                </div>}
                                {(JSON.parse(d.obj || "{}").cType || 'текст') === 'файл' && <div style={{display:'grid',justifyItems:'center',textAlign:'center'}}>
                                    {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && (watchText[d.id] || !data.description || !data.description.trim().length)?<div style={{}}>
                                        <Editor
                                            apiKey='3hgh0lh5euqgmlarql66lcizcd26ho2bhecnji42flbhyoue'
                                            onInit={(evt, editor) => editorRef.current[key] = editor}
                                            initialValue={d.description || ''}
                                            init={{
                                            height: 200,
                                            menubar: true,
                                            plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                            content_style: 'body {font-size:'+(JSON.parse(data.obj || "{}").fontSize || 1)+'em }'
                                            }}
                                        />
                                        <button style={{color:inface.acolor,background:inface.aback,marginTop:'5px'}} onClick={()=>{console.log(watchText);if(editorRef.current[key]){let WT = JSON.parse(JSON.stringify(watchText));WT[d.id] = false;setWatchText(WT);setCAttr('description',editorRef.current[key].getContent(),data.id+'quiz',d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}}>Сохранить</button>
                                    </div>:<div className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){let WT = JSON.parse(JSON.stringify(watchText));WT[d.id] = true;setWatchText(WT);}}} style={{width:'100%',}} dangerouslySetInnerHTML={{__html:d.description || ''}}/>}
                                    <div>
                                        <input onChange={e=>{setBtnD(false);/*setQuestion(question + 1)*/setQuizImg(e.target.files[0]);}} style={{visibility:'hidden',position:'absolute'}} type="file" id="input_file"/>
                                        <label style={{background:'#F5F6F6',display:'grid',justifyItems:'center',padding:'30px',cursor:'pointer',borderRadius:'10px'}} htmlFor="input_file">
                                            <LazyImage style={{marginBottom:'15px',justifySelf:'center',width:'5em',}} className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} src={process.env.REACT_APP_API_URL + 'cam.png'} alt=''/>
                                            <b>Добавить фото</b>
                                        </label>
                                    </div>
                                    {[1,1,1,1,1,1,1,1,1].map((m,i)=>i <= (JSON.parse(d.obj || "{}").count || 1) - 1 && <div>
                                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&<input defaultValue={JSON.parse(d.obj || "{}")['PH'+i] || ''} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1['PH'+i] = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'1em',background:inface.aback,color:inface.acolor,width:'350px'}} type='text'/>}
                                        <input onBlur={e=>{let obj1 = JSON.parse(JSON.stringify(quizObj));obj1[JSON.parse(d.obj || "{}")['PH'+i]] = e.target.value;setQuizObj(obj1)}} onChange={e=>setBtnD(e.target.value.trim().length > 0?false:true)} style={{width:(JSON.parse(d.obj || "{}")['PH'+i] || '').length * 8.8 + 'px',maxWidth:'calc(100% - 40px)',padding:'25px 20px',border:'1px #D3D5D5 solid',marginTop:'15px'}} placeholder={JSON.parse(d.obj || "{}")['PH'+i] || ''} type="text"/>
                                    </div>)}
                                    <br/>{question < inface.components.filter(d=>d.type===data.id+'quiz').length - 1 && JSON.parse(d.obj || "{}").skip && <button onClick={()=>{if(question < inface.components.filter(d=>d.type===data.id+'quiz').length - 1){setQuestion(question + 1)}}} style={{background:'transparent',border:'none',textDecoration:'underline',cursor:'pointer'}}>Пропустить вопрос</button>}
                                </div>}
                                <div style={{position:'relative'}}>
                                    {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<div style={{}}>
                                    {d.img && <LazyImage className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} style={{marginBottom:'15px',justifySelf:'center',width:'100%',}} src={process.env.REACT_APP_API_URL + d.img} alt=''/>}
                                    {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) &&!d.img?<div style={{fontSize:'0.82em',width:'140px',overflow:'hidden',zIndex:'1'}}><input style={{width:'140px',}} onChange={e=>{setCAttr('img',e.target.files[0],data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} type='file'/></div>:<div style={{width:'20px',top:'0px',right:'0px',overflow:'hidden',position:'absolute',zIndex:'1'}}><svg onClick={()=>{setCAttr('imgRm',d.img,data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',width:'20px',height:'20px',marginRight:'10px',fill:inface.acolor,zIndex:'4',overflow:'hidden',}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg></div>}
                                    </div>:
                                    <LazyImage className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} style={{marginBottom:'15px',justifySelf:'center',width:'100%',}} src={process.env.REACT_APP_API_URL + d.img} alt=''/>}
                                </div>
                            </div>
                            <div style={{gridColumn:'1/3',alignSelf:'end',display:'grid',gridTemplateColumns:'1fr 1fr',width:'100%'}}>
                                <button onClick={()=>{setQuestion(question - 1);setBtnD(false)}} style={{visibility:question > 0?'visible':'hidden',padding:inface.width > 1100?'15px 40px':'10px 30px',background:'transparent',border:'none',cursor:'pointer',justifySelf:'start'}}><b>&lang;<b style={{opacity:'0.5'}}>&lang;&lang;</b></b> <span style={{verticalAlign:'bottom'}}>Назад</span></button>
                                <button onClick={()=>{if(maxQ < question + 1){setBtnD(true)}if(maxQ < question){setMaxQ(question)}if(question < inface.components.filter(d=>d.type===data.id+'quiz').length - 1){setQuestion(question + 1);}else{setQuizEnd(true);localStorage.setItem('quizCond',new Date().toISOString().split('T')[0]);let form = new FormData();let obj1 = JSON.parse(JSON.stringify(quizObj));form.append('obj',JSON.stringify(obj1));if(quizImg){form.append('img',quizImg)};form.append('code','!s_pd%ad1fdsemffgqd!^$^@%&^fa*&Y_s--dsf--j9UJ_p-ga=aw--=+an_se-dq=ra$$b$');sendQuiz(form)}}} style={{opacity:btnD?'0.4':'1',padding:inface.width > 1100?'15px 40px':'10px 30px',color:'white',borderRadius:'10px',background:inface.interface.main,border:'none',cursor:btnD?'default':'pointer',justifySelf:'end'}} disabled={btnD}><span style={{verticalAlign:'bottom'}}>{question === inface.components.filter(d=>d.type===data.id+'quiz').length - 1?"Получить результат":"Далее"}</span> <b><b style={{opacity:'0.5'}}>&rang;&rang;</b>&rang;</b></button>
                            </div>
                        </div>)}
                    </div>}
                    {(JSON.parse(d.obj || "{}").cType || 'тест') === 'сайдбар' &&<div>
                    <div style={{padding:inface.width > 950?'25px':'15px',width:inface.width > 950?'calc(100% - 50px)':'calc(100% - 30px)',color:JSON.parse(d.obj || "{}").color || data.color || inface.interface.color,background:JSON.parse(d.obj || "{}").background || data.background || inface.interface.background,placeItems:'center',position:'relative',borderRadius:'15px',}}>
                        <div style={{display:'grid',gridTemplateColumns:'100px 1fr',gridGap:'2em'}}>
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<div style={{position:'relative'}}>
                                {d.img && <LazyImage className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} style={{marginBottom:'15px',justifySelf:'center',width:'100px',}} src={process.env.REACT_APP_API_URL + d.img} alt=''/>}
                                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && !d.img?<div style={{fontSize:'0.82em',width:'100px',overflow:'hidden',zIndex:'1'}}><input style={{width:'140px',}} onChange={e=>{setCAttr('img',e.target.files[0],data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} type='file'/></div>:<div style={{width:'20px',top:'0px',right:'0px',overflow:'hidden',position:'absolute',zIndex:'1'}}><svg onClick={()=>{setCAttr('imgRm',d.img,data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{cursor:'pointer',width:'20px',height:'20px',marginRight:'0px',fill:inface.acolor,zIndex:'4',overflow:'hidden',}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg></div>}
                            </div>:
                            <LazyImage className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} style={{marginBottom:'15px',justifySelf:'center',width:inface.width > 950?'100px':'70px',float:'left'}} src={process.env.REACT_APP_API_URL + d.img} alt=''/>}
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && (watchText[d.id] || !d.description || !d.description.trim().length)?<div style={{}}>
                                <Editor
                                    apiKey='3hgh0lh5euqgmlarql66lcizcd26ho2bhecnji42flbhyoue'
                                    onInit={(evt, editor) => editorRef.current[key] = editor}
                                    initialValue={d.description || ''}
                                    init={{
                                    height: 220,
                                    menubar: true,
                                    plugins: [
                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                    'insertdatetime', 'media', 'table', 'code', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                    'bold italic forecolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help',
                                    content_style: 'body {font-size:'+(JSON.parse(data.obj || "{}").fontSize || 1)+'em }'
                                    }}
                                />
                                <button style={{color:inface.acolor,background:inface.aback,marginTop:'5px'}} onClick={()=>{if(editorRef.current[key]){let WT = JSON.parse(JSON.stringify(watchText));WT[d.id] = false;setWatchText(WT);setCAttr('description',editorRef.current[key].getContent(),data.id+'',d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}}>Сохранить</button>
                            </div>:<div className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){let WT = JSON.parse(JSON.stringify(watchText));WT[d.id] = true;setWatchText(WT);}}} style={{float:'left',}} dangerouslySetInnerHTML={{__html:d.description || ''}}/>}
                            </div>
                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && (watchText[d.id+'ot1'] || !JSON.parse(d.obj || "{}").text1 || !JSON.parse(d.obj || "{}").text1.trim().length)?<div style={{}}>
                            <Editor
                                apiKey='3hgh0lh5euqgmlarql66lcizcd26ho2bhecnji42flbhyoue'
                                onInit={(evt, editor) => editorRef.current[key] = editor}
                                initialValue={JSON.parse(d.obj || "{}").text1 || ''}
                                init={{
                                height: 220,
                                menubar: true,
                                plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'wordcount'
                                ],
                                toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                                content_style: 'body {font-size:'+(JSON.parse(data.obj || "{}").fontSize || 1)+'em }'
                                }}
                            />
                            <button style={{color:inface.acolor,background:inface.aback,marginTop:'5px'}} onClick={()=>{if(editorRef.current[key]){let WT = JSON.parse(JSON.stringify(watchText));WT[d.id+'ot1'] = false;setWatchText(WT);let obj1 = JSON.parse(d.obj || "{}");obj1.text1 = editorRef.current[key].getContent();setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}}}>Сохранить</button>
                        </div>:<div className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){let WT = JSON.parse(JSON.stringify(watchText));WT[d.id+'ot1'] = true;setWatchText(WT);}}} style={{}} dangerouslySetInnerHTML={{__html:JSON.parse(d.obj || "{}").text1 || ''}}/>}
                        {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<input defaultValue={JSON.parse(d.obj || "{}").number || ''} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.number = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.6em',background:inface.aback,color:inface.acolor,width:'350px'}} placeholder="number" type='text'/>:
                        JSON.parse(d.obj || "{}").number && <a style={{fontSize:'1.5em',textDecoration:'none',fontWeight:'bold',color:inface.interface.main || 'black',textAlign:'center',display:'block'}} href={'tel:'+JSON.parse(d.obj || "{}").number}>{JSON.parse(d.obj || "{}").number}</a>}
                        <div style={{textAlign:'center',paddingTop:'30px'}}>
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<input defaultValue={JSON.parse(d.obj || "{}").tg || ''} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.tg = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.6em',background:inface.aback,color:inface.acolor,width:'350px'}} placeholder="tg" type='text'/>:
                            JSON.parse(d.obj || "{}").tg && <a style={{margin:'0 10px'}} target="_blank" rel="noopener noreferrer" href={JSON.parse(d.obj || "{}").tg}><LazyImage style={{width:'50px'}} src={process.env.REACT_APP_API_URL + 'tg.png'}/></a>}
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<input defaultValue={JSON.parse(d.obj || "{}").wa || ''} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.wa = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.6em',background:inface.aback,color:inface.acolor,width:'350px'}} placeholder="whatsapp" type='text'/>:
                            JSON.parse(d.obj || "{}").wa && <a style={{margin:'0 10px'}} target="_blank" rel="noopener noreferrer" href={JSON.parse(d.obj || "{}").wa}><LazyImage style={{width:'50px'}} src={process.env.REACT_APP_API_URL + 'wa.png'}/></a>}
                            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<input defaultValue={JSON.parse(d.obj || "{}").vk || ''} onBlur={e=>{let obj1 = JSON.parse(d.obj || "{}");obj1.vk = e.target.value;setCAttr('obj',JSON.stringify(obj1),data.id,d.id).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.6em',background:inface.aback,color:inface.acolor,width:'350px'}} placeholder="vk" type='text'/>:
                            JSON.parse(d.obj || "{}").vk && <a style={{margin:'0 10px'}} target="_blank" rel="noopener noreferrer" href={JSON.parse(d.obj || "{}").vk}><LazyImage style={{width:'50px'}} src={process.env.REACT_APP_API_URL + 'vk.png'}/></a>}
                        </div>
                    </div>
                    <div style={{display:inface.width > 1100?'grid':'none',gridGap:'1.6em',marginTop:'5em'}}>
                        <b style={{padding:'0 25%',textAlign:'center'}}>После прохождения теста, Вы получите:</b>
                        <LazyImage style={{width:'100%',borderRadius:'15px'}} className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} src={process.env.REACT_APP_API_URL + 'quizDown.png'} alt=''/>
                    </div>
                    </div>}
                </div>
            </div>)})}
            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && CL === 0 &&<div onClick={()=>addComponent(data.id+'',0).then(d=>{inface.setComponents(d)}).catch(d=>alert(d))} style={{cursor:'pointer',fontSize:'16px',border:'1px '+inface.acolor+' solid',background:inface.aback,borderRadius:'20px',marginTop:'50px',justifySelf:'end',display:'inline-block',width:'50%',textAlign:'center',position:'relative',}}>
                <div className='serviceElement' style={{margin:'0 40px',width:'50px',position:'relative',padding:'200px 0',display:'inline-block',gridTemplateColumns:'100%',textAlign:'center'}}>
                    <svg style={{verticalAlign:'top',width:'50px',height:'50px',fill:inface.acolor,overflow:'hidden',position:'relative'}} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#plusSVG' ></use></svg>
                </div>
            </div>}
        </div>
    </div>
    );



    //return("Выберите вариацию postheader'a")

});


export default Block;