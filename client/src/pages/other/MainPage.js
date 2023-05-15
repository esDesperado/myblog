import React, {useContext, useEffect,useState,useRef} from 'react';
import {observer} from "mobx-react-lite";
import {ADMIN_ROUTE} from "../../utils/consts";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {setIAttr,setBAttr,addBlock,auth,changeSite,setObjProperty} from "../../http/API"
import {Editor} from '@tinymce/tinymce-react';
import Distrib from "../../components/Distrib"
import LazyImage from "../../components/LazyImage";

const MainPage = observer(() => {
    const navigate = useNavigate()
    const dmnLogin = useRef(0)
    const dmnBtn = useRef(0)
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const editorRef = useRef(0)
    const {inface,user} = useContext(Context)
    const [prodCount,setProdCount] = useState(1)
    function checkBtn(){
        let passV = document.getElementById('dmnPass').value.trim()
        let pnV = document.getElementById('dmnLog').value.trim()
        if(pnV === '' || passV === ''){}else{
            logIn()
        }
    }
    function logIn(){
        let passV = document.getElementById('dmnPass').value.trim()
        let pnV = document.getElementById('dmnLog').value.trim()
        if(!parseInt(localStorage.getItem('tryCount')) || parseInt(localStorage.getItem('tryCount')) < 15){
            auth(pnV,passV).then(data=>{if(data !== 'false'){user.setRole(data.role);localStorage.removeItem('tryCount')}else{localStorage.setItem('tryCount',localStorage.getItem('tryCount')?parseInt(localStorage.getItem('tryCount'))+1:1)};}).catch(()=>localStorage.setItem('tryCount',localStorage.getItem('tryCount')?parseInt(localStorage.getItem('tryCount'))+1:1))
        }else{auth(pnV,passV,true);localStorage.setItem('tryDate',new Date().toISOString().split('T')[0])}
        setLogin('')
        setPassword('')
        dmnLogin.current.style.display='none'
    }
    const logOut = ()=>{
        user.setRole(0)
        localStorage.removeItem('token')
        window.localStorage.removeItem('token')
        navigate(document.location.pathname.replace(ADMIN_ROUTE,''))
    }
    const [loadCount,setLoadCount] = useState(1)
    useEffect(()=>{
        if(loadCount <= inface.blocks.length && (inface.blocks.filter(bl=>bl.page === inface.pages.filter(page=>page.path === document.location.pathname.replace(ADMIN_ROUTE,'').replace('/',''))[0].id && bl.type==='post-header')[0]?inface.show:true)){
            const loadTimer = setTimeout(()=>{setLoadCount(loadCount + 1)},400)
            return () => clearTimeout(loadTimer)
        }
    },[loadCount,inface.show])
    useEffect(()=>{
        if(inface.blocks.filter(bl=>bl.page === inface.pages.filter(page=>page.path === document.location.pathname.replace(ADMIN_ROUTE,'').replace('/',''))[0].id && bl.type==='post-header')[0]?inface.show:true){
            const FDAItems = document.querySelectorAll('.FDAStart')
            if(FDAItems.length > 0){
                window.addEventListener('scroll',animOnScroll)
                function animOnScroll(params){
                    Array.from(FDAItems).map(item=>{
                        let h1 = item.offsetHeight
                        let t1 = offset(item).top
                        //const startAnim = 5
                        let animPoint = 0
                        if(t1 > document.documentElement.clientHeight){
                            animPoint = (t1 - document.documentElement.clientHeight)
                        }
                        /*if(h1 > document.documentElement.clientHeight){
                            animPoint = t1 - document.documentElement.clientHeight / startAnim
                        }*/
                        if(inface.mobile){
                            if((((window.pageYOffset > animPoint - 100) || t1 - 150 < document.documentElement.clientHeight) && window.pageYOffset < (t1 + h1)) || window.pageYOffset >= document.getElementById('root').offsetHeight - document.documentElement.clientHeight - 150){
                                item.classList.add('FDAEnd')
                            }
                        }else{
                            if((((window.pageYOffset > animPoint) || t1 - 150 < document.documentElement.clientHeight) && window.pageYOffset < (t1 + h1)) || window.pageYOffset >= document.getElementById('root').offsetHeight - document.documentElement.clientHeight - 150){
                                item.classList.add('FDAEnd')
                            }else{
                                //item.classList.remove('FDAEnd')
                            }
                        }
                    })
                }
                function offset(el){
                    const rect = el.getBoundingClientRect(),
                        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        return {top:rect.top + scrollTop,left:rect.left + scrollLeft}
                }
                animOnScroll();
            }
        }
    },[document.getElementById('root').offsetHeight,document.querySelectorAll('.FDAStart').length,(inface.blocks.filter(bl=>bl.page === inface.pages.filter(page=>page.path === document.location.pathname.replace(ADMIN_ROUTE,'').replace('/',''))[0].id && bl.type==='post-header')[0]?inface.show:true)])
    let curX = 0
    let curY = 0
    document.addEventListener('mousemove',e=>{
        curX = e.pageX
        curY = e.pageY
    })
    let timer = null
    if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){
        document.addEventListener('scroll',e=>{
            if(timer !== null){clearTimeout(timer)}
            let block = document.getElementById('blockSettings')
            let cont = block.getBoundingClientRect()
            if(parseFloat(window.getComputedStyle(document.getElementById('blockSettings')).getPropertyValue('opacity')) > 0 && (!(curX >= cont.left && curX <= cont.right) || !(curY >= cont.top && curY <= cont.bottom))){
                block.style.opacity = 0.1
            }
            timer = setTimeout(()=>{
                if(parseFloat(window.getComputedStyle(document.getElementById('blockSettings')).getPropertyValue('opacity')) > 0){
                    block.style.opacity = 1
                }
            },500)
            return () => {clearTimeout(timer);}
        })
    }
    let [styleShow,setStyleShow] = useState(false)
    let [styleMShow,setStyleMShow] = useState(false)
    let [backgroundShow,setBackgroundShow] = useState(false)
    let [JSShow,setJSShow] = useState(false)
    let [HTMLShow,setHTMLShow] = useState(true)
    let [sliderShow,setSliderShow] = useState(true)
    let [clickShow,setClickShow] = useState(false)
    let [styles,setStyles] = useState([])
    let [stylesM,setStylesM] = useState([])
    function changeStyleProperty(property,value){
        let objCSS = JSON.parse(JSON.stringify(styles));
        objCSS[property] = value;
        setStyles(objCSS)
        let toCSS = '';
        for(let key in objCSS){toCSS = toCSS + key+':'+objCSS[key]+';\n'};
        let obj1 = JSON.parse(inface.currSettings.obj || "{}");
        obj1.css = toCSS;
        document.getElementById('settingsCssTextarea').value = toCSS;
        setBAttr('obj',JSON.stringify(obj1),inface.currSettings.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d));
        let newSettings = JSON.parse(JSON.stringify(inface.currSettings));
        newSettings.obj = JSON.stringify(obj1);
        inface.setCurrSettings(newSettings)
    }
    useEffect(()=>{
        if(inface.currSettings && document.getElementById('settingsCssMTextarea') && document.getElementById('settingsCssTextarea') && document.getElementById('settingsJSTextarea')){
            document.getElementById('settingsCssMTextarea').value = JSON.parse(inface.currSettings.obj || "{}").cssM || '';
            document.getElementById('settingsCssTextarea').value = JSON.parse(inface.currSettings.obj || "{}").css || '';
            document.getElementById('settingsJSTextarea').value = JSON.parse(inface.currSettings.obj || "{}").js || '';
        }
        let css = (JSON.parse((inface.currSettings || {}).obj || "{}").css || '').trim().replace(/\n/g, "")
        if(css[css.length - 1] === ';'){css = css.substring(0, css.length - 1)}
        let styles2 = {}
        css.split(';').filter(d=>{
            d = d.trim()
            let arr = d.split(':')
            styles2[arr[0]] = arr[1];
            return
        })
        setStyles(styles2)
        css = (JSON.parse((inface.currSettings || {}).obj || "{}").cssM || '').trim().replace(/\n/g, "")
        if(css[css.length - 1] === ';'){css = css.substring(0, css.length - 1)}
        styles2 = {}
        css.split(';').filter(d=>{
            let arr = d.split(':')
            styles2[arr[0]] = arr[1];
            return
        })
        setStylesM(styles2)
        /*let newSettings = JSON.parse(JSON.stringify(inface.currSettings));newSettings.obj = JSON.stringify(obj1);inface.setCurrSettings(newSettings)*/
    },[JSON.stringify(inface.currSettings || '{}')])
    function changeStyleMProperty(property,value){
        let objCSS = JSON.parse(JSON.stringify(stylesM));
        objCSS[property] = value;
        setStylesM(objCSS)
        let toCSS = '';
        for(let key in objCSS){toCSS = toCSS + key+':'+objCSS[key]+';\n'};
        let obj1 = JSON.parse(inface.currSettings.obj || "{}");
        obj1.cssM = toCSS;
        document.getElementById('settingsCssMTextarea').value = toCSS;
        setBAttr('obj',JSON.stringify(obj1),inface.currSettings.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d));
        let newSettings = JSON.parse(JSON.stringify(inface.currSettings));
        newSettings.obj = JSON.stringify(obj1);
        inface.setCurrSettings(newSettings)
    }
    let [page,setPage] = useState(inface.pages.filter(page=>page.path === document.location.pathname.replace(ADMIN_ROUTE,'').replace('/',''))[0])
    useEffect(()=>{
        setPage(inface.pages.filter(page=>page.path === document.location.pathname.replace(ADMIN_ROUTE,'').replace('/',''))[0])
        if(document.title !== JSON.parse(page.obj || '{}').title){document.title = page.title}
        document.querySelector('meta[name="description"]').setAttribute("content",JSON.parse(page.obj || '{}').description || '');
        document.querySelector('meta[name="keywords"]').setAttribute("content",JSON.parse(page.obj || '{}').keywords || '');
        if(JSON.parse(page.obj || '{}').js && (!user.role > 0 || !document.location.pathname.includes(ADMIN_ROUTE))){
            try{window.eval(JSON.parse(page.obj || '{}').js)}catch(err){console.error('Ошибка во время исполнения кода: \n\n',err)}
        }
    },[document.location.pathname])
    useEffect(()=>{
        document.addEventListener('click',e=>{
            if(inface.blockType){
                let obj2 = inface.blocks.filter(d=>d.id+'' === inface.moveblock.replace('block',''))[0] || {}
                if((obj2.type==='Контейнер' || obj2.type==='Список товаров') || (inface.moveblock === '' || inface.moveblock.includes('page'))){
                    let obj3 = JSON.parse(inface.objList[inface.blockType] || '{}')
                    obj3.category = inface.category
                    addBlock(inface.blockType,(inface.moveblock === '' || inface.moveblock.includes('page'))?1:inface.blocks.filter(d=>d.parent === inface.moveblock).length + 1,inface.moveblock === '' || inface.moveblock.includes('page')?'page'+inface.pages.filter(page=>page.path === document.location.pathname.replace(ADMIN_ROUTE,'').replace('/',''))[0].id:inface.moveblock,JSON.stringify(obj3)).then(d=>inface.setBlocks(d))
                    inface.setBlockType(null)
                }
            }
        })
    },[inface.blockType])
    let [categories,setCategories] = useState([])
    useEffect(()=>{
        let arr2 = categories
        inface.blocks.map(d=>{
            if(d.type === 'Товар' && JSON.parse(d.obj || "{}").category && !arr2.includes(JSON.parse(d.obj || "{}").category)){
                arr2.push(JSON.parse(d.obj || "{}").category)
            }
        })
        setCategories(arr2)
    },[JSON.stringify(inface.blocks)])
    let [cost,setCost] = useState(0)
    useEffect(()=>{
        let prods = {}
        inface.blocks.filter(d=>inface.basket.includes(d.id)).map(d=>prods[d.id] = JSON.parse(d.obj || "{}").price || 0)
        let cost1 = 0
        inface.basket.map(d=>cost1 += parseFloat(prods[d]))
        setCost(cost1)
        localStorage.setItem('basket',JSON.stringify(inface.basket))
    },[inface.basket.length])
    return(
        <div style={{width:'100%',color:inface.interface.color,background:inface.interface.background,fontSize:inface.width > 350?inface.width > 600?'16px':'12px':'11px',position:'relative',}}>
            {user.role > 0 && document.location.pathname.includes(ADMIN_ROUTE) && <div id={'blockSettings'} style={{overflowY:'auto',boxShadow:'-5px 0px 50px #C7C7C799',position:'fixed',width:'300px',zIndex:'1009',height:inface.height,top:'0px',right:0,opacity:0,display:'none',transitionDuration:"0.5s",fontWeight:'bold',fontSize:"0.8em",background:'white',color:'black',padding:'65px 10px',}}>
                <div style={{fontSize:'1.3em'}}>Настройки
                    <select onChange={e=>{let newObj = inface.blocks.filter(d=>d.type + ' ' + d.id === e.target.value)[0];inface.setCurrSettings(newObj);}} value={inface.currSettings?inface.currSettings.type + ' ' + inface.currSettings.id:''}>
                        {inface.blocks.slice().sort((a,b)=>a.id-b.id).map((d,key)=><option>{d.type + ' ' + d.id}</option>)}
                    </select>
                </div>
                <svg onClick={()=>{document.getElementById('blockSettings').style.opacity=0;document.getElementById('blockSettings').style.display = 'none';inface.setCurrSettings(null)}} style={{top:'65px',right:'20px',position:'absolute',cursor:'pointer',width:'13px',height:'13px',marginRight:'10px',fill:'black',}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>
                {inface.currSettings && inface.currSettings.type === 'HTML блок' && <div style={{position:'relative',width:'calc(100% - 20px)',paddingTop:'1.3em'}}>
                    <div onClick={()=>{setHTMLShow(!HTMLShow)}} style={{cursor:'pointer',fontSize:'1.1em',zIndex:'2',position:'relative'}}>HTML код<svg style={{transform:HTMLShow?'rotate(180deg)':'rotate(0)',transitionDuration:'0.3s',top:'2px',right:'0px',position:'absolute',fill:'black',width:'1em',height:'1em',}} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#upSVG' ></use></svg></div>
                    <div style={{padding:'10px',opacity:HTMLShow?'1':'0',transitionDuration:'0.3s',position:HTMLShow?'relative':'absolute'}}>
                        &#60;div id='block{inface.currSettings.id}'&#62;<br/>
                        <textarea id='settingsHTMLTextarea' onBlur={e=>{let obj1 = JSON.parse(inface.currSettings.obj || "{}");obj1.html = e.target.value;setObjProperty('html',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d));let newSettings = JSON.parse(JSON.stringify(inface.currSettings));newSettings.obj = JSON.stringify(obj1);inface.setCurrSettings(newSettings)}} style={{width:'100%'}} rows='10' defaultValue={JSON.parse(inface.currSettings.obj || "{}").html || ''}/>
                        &#60;/div&#62;
                    </div>
                </div>}
                {inface.currSettings && inface.currSettings.type === 'Копия'?<div style={{margin:'1em 0'}}>
                        Копируемый блок:
                        <select onChange={e=>{setObjProperty('elementId',e.target.value.split('_')[e.target.value.split('_').length - 1],inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])})}} value={JSON.parse(inface.currSettings.obj || '{}').elementId?(inface.blocks.filter(d=>d.id === parseInt(JSON.parse(inface.currSettings.obj || '{}').elementId))[0].type + '_' + JSON.parse(inface.currSettings.obj || '{}').elementId):'Блок не выбран'}>
                            <option>Блок не выбран</option>
                            {inface.blocks.slice().sort((a,b)=>a.id-b.id).map((d,key)=>d.type !== 'Копия' &&<option>{d.type + '_' + d.id}</option>)}
                        </select>
                    </div>:
                    <div>
                    {inface.currSettings && inface.currSettings.type === 'Товар' &&<div style={{position:'relative',width:'calc(100% - 20px)',paddingTop:'1.3em',}}>
                        Категория: <select value={JSON.parse(inface.currSettings.obj || "{}").category} onChange={e=>{if(e.target.value === 'Добавить категорию'){let cat = prompt("Введите название категории");setObjProperty('category',cat,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d));e.target.value = cat;}else{setObjProperty('category',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d));}}} onClick={e=>{if(e.target.value === 'Добавить категорию'){let cat = prompt("Введите название категории:");setObjProperty('category',cat,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d));e.target.value = cat;}}}>
                            {categories.map(d=><option>{d}</option>)}
                            <option>Добавить категорию</option>
                        </select><br/><br/>
                        Название:{inface.blocks.map(d=>d.type === 'Товар' && d.id === inface.currSettings.id &&<input defaultValue={JSON.parse(inface.currSettings.obj || "{}").title} onBlur={e=>{setObjProperty('title',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d));}} type='text' className='niceInput'/>)}<br/><br/>
                        Цена:{inface.blocks.map(d=>d.type === 'Товар' && d.id === inface.currSettings.id &&<input defaultValue={JSON.parse(inface.currSettings.obj || "{}").price} onBlur={e=>{setObjProperty('price',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d));}} type='number' min="0" className='niceInput'/>)}<br/><br/>
                        Изображение: {!JSON.parse(inface.currSettings.obj || "{}").background || !JSON.parse(inface.currSettings.obj || "{}").background.length?<button onClick={()=>{inface.setCurrImageProp('background');document.getElementById('theOnlyOneBody').style.overflow = 'hidden'}} className='niceBtn'>Выберите файл</button>:<span style={{fontWeight:'400',}}>{JSON.parse(inface.currSettings.obj).background.substr(0, 5)}...{JSON.parse(inface.currSettings.obj).background.substr(JSON.parse(inface.currSettings.obj).background.length - 9, 9)}<svg onClick={()=>{setObjProperty('background','',inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{cursor:'pointer',width:'1em',height:'1em',marginLeft:'10px',fill:inface.acolor,verticalAlign:'middle'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg></span>}<br/><br/>
                        {1 < 0 &&<div>Краткое описание:{inface.blocks.map(d=>d.type === 'Товар' && d.id === inface.currSettings.id &&<textarea rows='5' style={{width:'100%'}} defaultValue={JSON.parse(inface.currSettings.obj || "{}").shortDesc} onBlur={e=>{setObjProperty('shortDesc',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d));}}/>)}<br/><br/></div>}


                    </div>}
                    {inface.currSettings && inface.currSettings.type !== 'Товар' &&<div style={{position:'relative',width:'calc(100% - 20px)',paddingTop:'1.3em',}}>
                        <div onClick={()=>{setStyleShow(!styleShow)}} style={{cursor:'pointer',fontSize:'1.1em',zIndex:'2',position:'relative'}}>Стили <svg style={{transform:styleShow?'rotate(180deg)':'rotate(0)',transitionDuration:'0.3s',top:'2px',right:'0px',position:'absolute',fill:'black',width:'1em',height:'1em',}} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#upSVG' ></use></svg></div>
                        <div style={{lineHeight:'1.8em',padding:'10px',display:styleShow?'block':'none',}}>
                            Цвет фона:<input value={styles['background'] || inface.interface.background || 'white'} onChange={e=>{changeStyleProperty('background',e.target.value)}} type='color'/>{styles['background']}{styles['background'] !== 'transparent' && <svg onClick={()=>{changeStyleProperty('background','transparent')}} style={{cursor:'pointer',verticalAlign:'middle',width:'13px',height:'13px',marginLeft:'10px',fill:'black',}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>}<br/>
                            Цвет шрифта:<input value={styles['color'] || inface.interface.color || 'black'} onChange={e=>{changeStyleProperty('color',e.target.value)}} type='color'/>{styles['color']}{styles['color'] !== 'inherit' && <svg onClick={()=>{changeStyleProperty('color','inherit')}} style={{cursor:'pointer',verticalAlign:'middle',width:'13px',height:'13px',marginLeft:'10px',fill:'black',}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>}<br/>
                            Размер шрифта:<input value={styles['font-size'] || '1em'} onChange={e=>{changeStyleProperty('font-size',e.target.value)}} type='text' className='niceInput'/><br/>
                            Расположение по горизонтали:<select onChange={e=>changeStyleProperty('justify-self',e.target.value === 'по центру'?'center':e.target.value === 'на всю ширину'?'stretch':e.target.value === 'справа'?'end':e.target.value === 'слева'?'start':'stretch')}  value={styles['justify-self'] === 'center'?'по центру':styles['justify-self'] === 'stretch'?'на всю ширину':styles['justify-self'] === 'end'?'справа':styles['justify-self'] === 'start'?'слева':'на всю ширину'}>
                                <option>по центру</option>
                                <option>на всю ширину</option>
                                <option>слева</option>
                                <option>справа</option>
                            </select><br/>
                            Расположение по вертикали:<select onChange={e=>changeStyleProperty('align-self',e.target.value === 'по центру'?'center':e.target.value === 'на всю высоту'?'stretch':e.target.value === 'снизу'?'end':e.target.value === 'сверху'?'start':'stretch')} value={styles['align-self'] === 'center'?'по центру':styles['align-self'] === 'stretch'?'на всю высоту':styles['align-self'] === 'end'?'снизу':styles['align-self'] === 'start'?'сверху':'на всю высоту'}>
                                <option>по центру</option>
                                <option>на всю высоту</option>
                                <option>сверху</option>
                                <option>снизу</option>
                            </select><br/>
                            {inface.currSettings.type === 'Контейнер' && <div>
                                Группировка ячеек:<select onChange={e=>changeStyleProperty('grid-auto-flow',e.target.value === 'Строки'?'row':'column')} value={styles['grid-auto-flow'] === 'column'?'Столбцы':'Строки'}>
                                <option>Строки</option>
                                <option>Столбцы</option>
                            </select><br/>
                                Количество столбцов: <input value={styles['grid-template-columns'] && styles['grid-template-columns'].includes('repeat')?styles['grid-template-columns'].replace('repeat(','').split(',')[0]:styles['grid-template-columns'] || 'none'} onChange={e=>{changeStyleProperty('grid-template-columns',parseInt(e.target.value)?'repeat('+e.target.value+',1fr)':e.target.value)}} type='text' style={{width:'70px'}} className='niceShortInput'/><br/>
                                Количество строк: <input value={styles['grid-template-rows'] && styles['grid-template-rows'].includes('repeat')?styles['grid-template-rows'].replace('repeat(','').split(',')[0]:styles['grid-template-rows'] || 'none'} onChange={e=>{changeStyleProperty('grid-template-rows',parseInt(e.target.value)?'repeat('+e.target.value+',1fr)':e.target.value)}} type='text' style={{width:'70px'}} className='niceShortInput'/><br/>
                                Расстояние между ячейками: <input value={styles['grid-gap'] || '0px'} onChange={e=>{changeStyleProperty('grid-gap',e.target.value)}} type='text' className='niceInput'/><br/>
                            </div>}
                            {inface.currSettings.type !== 'Картинка' && inface.currSettings.type !== 'Текст' && <div>
                                Расположение элементов по горизонтали:<select onChange={e=>changeStyleProperty('justify-items',e.target.value === 'по центру'?'center':e.target.value === 'на всю ширину'?'stretch':e.target.value === 'справа'?'end':e.target.value === 'слева'?'start':'stretch')}  value={styles['justify-items'] === 'center'?'по центру':styles['justify-items'] === 'stretch'?'на всю ширину':styles['justify-items'] === 'end'?'справа':styles['justify-items'] === 'start'?'слева':'на всю ширину'}>
                                    <option>по центру</option>
                                    <option>на всю ширину</option>
                                    <option>слева</option>
                                    <option>справа</option>
                                </select><br/>
                                Расположение элементов по вертикали:<select onChange={e=>changeStyleProperty('align-items',e.target.value === 'по центру'?'center':e.target.value === 'на всю высоту'?'stretch':e.target.value === 'снизу'?'end':e.target.value === 'сверху'?'start':'stretch')} value={styles['align-items'] === 'center'?'по центру':styles['align-items'] === 'stretch'?'на всю высоту':styles['align-items'] === 'end'?'снизу':styles['align-items'] === 'start'?'сверху':'на всю высоту'}>
                                    <option>по центру</option>
                                    <option>на всю высоту</option>
                                    <option>сверху</option>
                                    <option>снизу</option>
                                </select>
                            </div>}
                            Мин. ширина:<input value={styles['min-width']} onChange={e=>{changeStyleProperty('min-width',e.target.value)}} type='text' className='niceInput'/><br/>
                            Мин. высота:<input value={styles['min-height']} onChange={e=>{changeStyleProperty('min-height',e.target.value)}} type='text' className='niceInput'/><br/>
                            <div>
                                Макс. ширина:<input value={styles['max-width']} onChange={e=>{changeStyleProperty('max-width',e.target.value)}} type='text' className='niceInput'/><br/>
                                Макс. высота:<input value={styles['max-height']} onChange={e=>{changeStyleProperty('max-height',e.target.value)}} type='text' className='niceInput'/><br/>
                            </div>
                            Сглаживание углов:<input value={styles['border-radius'] || 0} onChange={e=>{changeStyleProperty('border-radius',e.target.value)}} style={{width:'80px'}} type='text' className='niceInput'/><br/>
                            Внешние отступы:
                            <div style={{paddingLeft:'10px',fontWeight:'300'}}>
                                Верхний:<input value={(styles['margin'] || '0 0 0 0').split(' ')[0]} onChange={e=>{let arr1 = (styles['margin'] || '0 0 0 0').split(' ');arr1[0] = e.target.value;changeStyleProperty('margin',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                                Нижний:<input value={(styles['margin'] || '0 0 0 0').split(' ')[2]} onChange={e=>{let arr1 = (styles['margin'] || '0 0 0 0').split(' ');arr1[2] = e.target.value;changeStyleProperty('margin',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                                Левый:<input value={(styles['margin'] || '0 0 0 0').split(' ')[3]} onChange={e=>{let arr1 = (styles['margin'] || '0 0 0 0').split(' ');arr1[3] = e.target.value;changeStyleProperty('margin',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                                Правый:<input value={(styles['margin'] || '0 0 0 0').split(' ')[1]} onChange={e=>{let arr1 = (styles['margin'] || '0 0 0 0').split(' ');arr1[1] = e.target.value;changeStyleProperty('margin',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                            </div>
                            Внутренние отступы:
                            <div style={{paddingLeft:'10px',fontWeight:'300'}}>
                                Верхний:<input value={(styles['padding'] || '0 0 0 0').split(' ')[0]} onChange={e=>{let arr1 = (styles['padding'] || '0 0 0 0').split(' ');arr1[0] = e.target.value;changeStyleProperty('padding',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                                Нижний:<input value={(styles['padding'] || '0 0 0 0').split(' ')[2]} onChange={e=>{let arr1 = (styles['padding'] || '0 0 0 0').split(' ');arr1[2] = e.target.value;changeStyleProperty('padding',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                                Левый:<input value={(styles['padding'] || '0 0 0 0').split(' ')[3]} onChange={e=>{let arr1 = (styles['padding'] || '0 0 0 0').split(' ');arr1[3] = e.target.value;changeStyleProperty('padding',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                                Правый:<input value={(styles['padding'] || '0 0 0 0').split(' ')[1]} onChange={e=>{let arr1 = (styles['padding'] || '0 0 0 0').split(' ');arr1[1] = e.target.value;changeStyleProperty('padding',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                            </div>
                            <br/>CSS:<br/>
                            #block{inface.currSettings.id}{'{'}
                            <textarea id='settingsCssTextarea' onBlur={e=>{let obj1 = JSON.parse(inface.currSettings.obj || "{}");obj1.css = e.target.value;setObjProperty('css',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d));let newSettings = JSON.parse(JSON.stringify(inface.currSettings));newSettings.obj = JSON.stringify(obj1);inface.setCurrSettings(newSettings)}} style={{width:'100%'}} rows='10' defaultValue={JSON.parse(inface.currSettings.obj || "{}").css || ''}/>
                            {'}'}
                        </div>
                    </div>}
                    {inface.currSettings && inface.currSettings.type !== 'Товар' &&<div style={{position:'relative',width:'calc(100% - 20px)',paddingTop:'1.3em'}}>
                        <div onClick={()=>{setStyleMShow(!styleMShow)}} style={{cursor:'pointer',fontSize:'1.1em',zIndex:'2',position:'relative'}}>Стили в мобильной версии<svg style={{transform:styleMShow?'rotate(180deg)':'rotate(0)',transitionDuration:'0.3s',top:'2px',right:'0px',position:'absolute',fill:'black',width:'1em',height:'1em',}} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#upSVG' ></use></svg></div>
                        <div style={{lineHeight:'1.8em',padding:'10px',display:styleMShow?'block':'none',}}>
                            Цвет фона:<input value={stylesM['background'] || inface.interface.background || 'white'} onChange={e=>{changeStyleMProperty('background',e.target.value)}} type='color'/>{stylesM['background']}{stylesM['background'] !== 'transparent' && <svg onClick={()=>{changeStyleMProperty('background','transparent')}} style={{cursor:'pointer',verticalAlign:'middle',width:'13px',height:'13px',marginLeft:'10px',fill:'black',}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>}<br/>
                            Цвет шрифта:<input value={stylesM['color'] || inface.interface.color || 'black'} onChange={e=>{changeStyleMProperty('color',e.target.value)}} type='color'/>{stylesM['color']}{stylesM['color'] !== 'inherit' && <svg onClick={()=>{changeStyleMProperty('color','inherit')}} style={{cursor:'pointer',verticalAlign:'middle',width:'13px',height:'13px',marginLeft:'10px',fill:'black',}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>}<br/>
                            Размер шрифта:<input value={stylesM['font-size'] || '1em'} onChange={e=>{changeStyleMProperty('font-size',e.target.value)}} type='text' className='niceInput'/><br/>
                            Расположение по горизонтали:<select onChange={e=>changeStyleMProperty('justify-self',e.target.value === 'по центру'?'center':e.target.value === 'на всю ширину'?'stretch':e.target.value === 'справа'?'end':e.target.value === 'слева'?'start':'stretch')}  value={stylesM['justify-self'] === 'center'?'по центру':stylesM['justify-self'] === 'stretch'?'на всю ширину':stylesM['justify-self'] === 'end'?'справа':stylesM['justify-self'] === 'start'?'слева':'на всю ширину'}>
                                <option>по центру</option>
                                <option>на всю ширину</option>
                                <option>слева</option>
                                <option>справа</option>
                            </select><br/>
                            Расположение по вертикали:<select onChange={e=>changeStyleMProperty('align-self',e.target.value === 'по центру'?'center':e.target.value === 'на всю высоту'?'stretch':e.target.value === 'снизу'?'end':e.target.value === 'сверху'?'start':'stretch')} value={stylesM['align-self'] === 'center'?'по центру':stylesM['align-self'] === 'stretch'?'на всю высоту':stylesM['align-self'] === 'end'?'снизу':stylesM['align-self'] === 'start'?'сверху':'на всю высоту'}>
                                <option>по центру</option>
                                <option>на всю высоту</option>
                                <option>сверху</option>
                                <option>снизу</option>
                            </select><br/>
                            {inface.currSettings.type === 'Контейнер' && <div>
                                Группировка ячеек:<select onChange={e=>changeStyleMProperty('grid-auto-flow',e.target.value === 'Строки'?'row':'column')} value={stylesM['grid-auto-flow'] === 'column'?'Столбцы':'Строки'}>
                                <option>Строки</option>
                                <option>Столбцы</option>
                            </select><br/>
                                Количество столбцов: <input value={stylesM['grid-template-columns'] && stylesM['grid-template-columns'].includes('repeat')?stylesM['grid-template-columns'].replace('repeat(','').split(',')[0]:stylesM['grid-template-columns'] || 'none'} onChange={e=>{changeStyleMProperty('grid-template-columns',parseInt(e.target.value)?'repeat('+e.target.value+',1fr)':e.target.value)}} type='text' style={{width:'70px'}} className='niceShortInput'/><br/>
                                Количество строк: <input value={stylesM['grid-template-rows'] && stylesM['grid-template-rows'].includes('repeat')?stylesM['grid-template-rows'].replace('repeat(','').split(',')[0]:stylesM['grid-template-rows'] || 'none'} onChange={e=>{changeStyleMProperty('grid-template-rows',parseInt(e.target.value)?'repeat('+e.target.value+',1fr)':e.target.value)}} type='text' style={{width:'70px'}} className='niceShortInput'/><br/>
                                Расстояние между ячейками: <input value={stylesM['grid-gap'] || '0px'} onChange={e=>{changeStyleMProperty('grid-gap',e.target.value)}} type='text' className='niceInput'/><br/>
                            </div>}
                            {inface.currSettings.type !== 'Картинка' && inface.currSettings.type !== 'Текст' && <div>
                                Расположение элементов по горизонтали:<select onChange={e=>changeStyleMProperty('justify-items',e.target.value === 'по центру'?'center':e.target.value === 'на всю ширину'?'stretch':e.target.value === 'справа'?'end':e.target.value === 'слева'?'start':'stretch')}  value={stylesM['justify-items'] === 'center'?'по центру':stylesM['justify-items'] === 'stretch'?'на всю ширину':stylesM['justify-items'] === 'end'?'справа':stylesM['justify-items'] === 'start'?'слева':'на всю ширину'}>
                                    <option>по центру</option>
                                    <option>на всю ширину</option>
                                    <option>слева</option>
                                    <option>справа</option>
                                </select><br/>
                                Расположение элементов по вертикали:<select onChange={e=>changeStyleMProperty('align-items',e.target.value === 'по центру'?'center':e.target.value === 'на всю высоту'?'stretch':e.target.value === 'снизу'?'end':e.target.value === 'сверху'?'start':'stretch')} value={stylesM['align-items'] === 'center'?'по центру':stylesM['align-items'] === 'stretch'?'на всю высоту':stylesM['align-items'] === 'end'?'снизу':stylesM['align-items'] === 'start'?'сверху':'на всю высоту'}>
                                    <option>по центру</option>
                                    <option>на всю высоту</option>
                                    <option>сверху</option>
                                    <option>снизу</option>
                                </select>
                            </div>}
                            Мин. ширина:<input value={stylesM['min-width']} onChange={e=>{changeStyleMProperty('min-width',e.target.value)}} type='text' className='niceInput'/><br/>
                            Мин. высота:<input value={stylesM['min-height']} onChange={e=>{changeStyleMProperty('min-height',e.target.value)}} type='text' className='niceInput'/><br/>
                            <div>
                                Макс. ширина:<input value={stylesM['max-width']} onChange={e=>{changeStyleMProperty('max-width',e.target.value)}} type='text' className='niceInput'/><br/>
                                Макс. высота:<input value={stylesM['max-height']} onChange={e=>{changeStyleMProperty('max-height',e.target.value)}} type='text' className='niceInput'/><br/>
                            </div>
                            Сглаживание углов:<input value={stylesM['border-radius'] || 0} onChange={e=>{changeStyleMProperty('border-radius',e.target.value)}} style={{width:'80px'}} type='text' className='niceInput'/><br/>
                            Внешние отступы:
                            <div style={{paddingLeft:'10px',fontWeight:'300'}}>
                                Верхний:<input value={(stylesM['margin'] || '0 0 0 0').split(' ')[0]} onChange={e=>{let arr1 = (stylesM['margin'] || '0 0 0 0').split(' ');arr1[0] = e.target.value;changeStyleMProperty('margin',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                                Нижний:<input value={(stylesM['margin'] || '0 0 0 0').split(' ')[2]} onChange={e=>{let arr1 = (stylesM['margin'] || '0 0 0 0').split(' ');arr1[2] = e.target.value;changeStyleMProperty('margin',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                                Левый:<input value={(stylesM['margin'] || '0 0 0 0').split(' ')[3]} onChange={e=>{let arr1 = (stylesM['margin'] || '0 0 0 0').split(' ');arr1[3] = e.target.value;changeStyleMProperty('margin',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                                Правый:<input value={(stylesM['margin'] || '0 0 0 0').split(' ')[1]} onChange={e=>{let arr1 = (stylesM['margin'] || '0 0 0 0').split(' ');arr1[1] = e.target.value;changeStyleMProperty('margin',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                            </div>
                            Внутренние отступы:
                            <div style={{paddingLeft:'10px',fontWeight:'300'}}>
                                Верхний:<input value={(stylesM['padding'] || '0 0 0 0').split(' ')[0]} onChange={e=>{let arr1 = (stylesM['padding'] || '0 0 0 0').split(' ');arr1[0] = e.target.value;changeStyleMProperty('padding',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                                Нижний:<input value={(stylesM['padding'] || '0 0 0 0').split(' ')[2]} onChange={e=>{let arr1 = (stylesM['padding'] || '0 0 0 0').split(' ');arr1[2] = e.target.value;changeStyleMProperty('padding',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                                Левый:<input value={(stylesM['padding'] || '0 0 0 0').split(' ')[3]} onChange={e=>{let arr1 = (stylesM['padding'] || '0 0 0 0').split(' ');arr1[3] = e.target.value;changeStyleMProperty('padding',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                                Правый:<input value={(stylesM['padding'] || '0 0 0 0').split(' ')[1]} onChange={e=>{let arr1 = (stylesM['padding'] || '0 0 0 0').split(' ');arr1[1] = e.target.value;changeStyleMProperty('padding',arr1.join(' '))}} type='text' className='niceInput'/><br/>
                            </div>
                            <br/>CSS:<br/>
                            #block{inface.currSettings.id}{'{'}
                            <textarea id='settingsCssMTextarea' onBlur={e=>{let obj1 = JSON.parse(inface.currSettings.obj || "{}");obj1.cssM = e.target.value;setObjProperty('cssM',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d));let newSettings = JSON.parse(JSON.stringify(inface.currSettings));newSettings.obj = JSON.stringify(obj1);inface.setCurrSettings(newSettings)}} style={{width:'100%'}} rows='10' defaultValue={JSON.parse(inface.currSettings.obj || "{}").cssM || ''}/>
                            {'}'}
                        </div>
                    </div>}
                    {inface.currSettings && inface.currSettings.type !== 'Товар' &&<div style={{position:'relative',width:'calc(100% - 20px)',paddingTop:'1.3em'}}>
                        <div onClick={()=>{setBackgroundShow(!backgroundShow)}} style={{cursor:'pointer',fontSize:'1.1em',zIndex:'2',position:'relative'}}>{inface.currSettings.type === 'Картинка'?'Картинка':'Фоновое изображение'}<svg style={{transform:backgroundShow?'rotate(180deg)':'rotate(0)',transitionDuration:'0.3s',top:'2px',right:'0px',position:'absolute',fill:'black',width:'1em',height:'1em',}} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#upSVG' ></use></svg></div>
                        <div style={{padding:'10px',opacity:backgroundShow?'1':'0',display:backgroundShow?'block':'none',transitionDuration:'0.3s',position:backgroundShow?'relative':'absolute'}}>
                            Изображение: {!JSON.parse(inface.currSettings.obj || "{}").background || !JSON.parse(inface.currSettings.obj || "{}").background.length?<button onClick={()=>{inface.setCurrImageProp('background');document.getElementById('theOnlyOneBody').style.overflow = 'hidden'}} className='niceBtn'>Выберите файл</button>:<span style={{fontWeight:'400',}}>{JSON.parse(inface.currSettings.obj).background.substr(0, 5)}...{JSON.parse(inface.currSettings.obj).background.substr(JSON.parse(inface.currSettings.obj).background.length - 9, 9)}<svg onClick={()=>{setObjProperty('background','',inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{cursor:'pointer',width:'1em',height:'1em',marginLeft:'10px',fill:inface.acolor,verticalAlign:'middle'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg></span>}
                            {inface.currSettings.type !== 'Картинка' &&<div>
                                Отступ справа:<input defaultValue={JSON.parse(inface.currSettings.obj || "{}").fRight || '0'} onBlur={e=>{setObjProperty('fRight',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} type='text' className='niceInput'/><br/>
                                Отступ снизу:<input defaultValue={JSON.parse(inface.currSettings.obj || "{}").fTop || '0'} onBlur={e=>{setObjProperty('fTop',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} type='text' className='niceInput'/><br/>
                                Ширина фона:<input defaultValue={JSON.parse(inface.currSettings.obj || "{}").fWidth || 'auto'} onBlur={e=>{setObjProperty('fWidth',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} type='text' className='niceInput'/><br/>
                                Цвет затенения:<input value={JSON.parse(inface.currSettings.obj || "{}").fBack || '#000000'} onChange={e=>{setObjProperty('fBack',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} type='color'/><br/>
                                Прозрачность тени:<input defaultValue={JSON.parse(inface.currSettings.obj || "{}").fOpacity || 0.5} onChange={e=>{setObjProperty('fOpacity',parseFloat(e.target.value),inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} max='1' step='0.05' min='0' type='number' className='niceShortInput'/><br/>
                                Мобильная версия:<br/>
                                <div style={{paddingLeft:'10px',fontWeight:'300'}}>
                                    Отступ справа:<input defaultValue={JSON.parse(inface.currSettings.obj || "{}").fRightM || '0'} onBlur={e=>{setObjProperty('fRightM',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} type='text' className='niceInput'/><br/>
                                    Отступ снизу:<input defaultValue={JSON.parse(inface.currSettings.obj || "{}").fTopM || '0'} onBlur={e=>{setObjProperty('fTopM',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} type='text' className='niceInput'/><br/>
                                    Ширина фона:<input defaultValue={JSON.parse(inface.currSettings.obj || "{}").fWidthM || 'auto'} onBlur={e=>{setObjProperty('fWidthM',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} type='text' className='niceInput'/><br/>
                                    Цвет затенения:<input value={JSON.parse(inface.currSettings.obj || "{}").fBackM || '#000000'} onChange={e=>{setObjProperty('fBackM',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} type='color'/><br/>
                                    Прозрачность тени:<input defaultValue={JSON.parse(inface.currSettings.obj || "{}").fOpacityM || 0.5} onChange={e=>{setObjProperty('fOpacityM',parseFloat(e.target.value),inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} max='1' step='0.05' min='0' type='number' className='niceShortInput'/><br/>
                                </div>
                            </div>}
                        </div>
                    </div>}
                    {inface.currSettings && inface.currSettings.type !== 'Товар' &&<div style={{position:'relative',width:'calc(100% - 20px)',paddingTop:'1.3em'}}>
                        <div onClick={()=>{setJSShow(!JSShow)}} style={{cursor:'pointer',fontSize:'1.1em',zIndex:'2',position:'relative'}}>JS<svg style={{transform:JSShow?'rotate(180deg)':'rotate(0)',transitionDuration:'0.3s',top:'2px',right:'0px',position:'absolute',fill:'black',width:'1em',height:'1em',}} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#upSVG' ></use></svg></div>
                        <div style={{padding:'10px',opacity:JSShow?'1':'0',display:JSShow?'block':'none',transitionDuration:'0.3s',position:JSShow?'relative':'absolute'}}>
                            <textarea id='settingsJSTextarea' onBlur={e=>{let obj1 = JSON.parse(inface.currSettings.obj || "{}");obj1.js = e.target.value;setObjProperty('js',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d)}).catch(d=>alert(d));let newSettings = JSON.parse(JSON.stringify(inface.currSettings));newSettings.obj = JSON.stringify(obj1);inface.setCurrSettings(newSettings)}} style={{width:'100%'}} rows='10' defaultValue={JSON.parse(inface.currSettings.obj || "{}").js || ''}/>
                        </div>
                    </div>}
                    {inface.currSettings && inface.currSettings.type !== 'Товар' && inface.currSettings.type === 'Слайдер' && <div style={{position:'relative',width:'calc(100% - 20px)',paddingTop:'1.3em'}}>
                        <div onClick={()=>{setSliderShow(!sliderShow)}} style={{cursor:'pointer',fontSize:'1.1em',zIndex:'2',position:'relative'}}>Слайды<svg style={{transform:sliderShow?'rotate(180deg)':'rotate(0)',transitionDuration:'0.3s',top:'2px',right:'0px',position:'absolute',fill:'black',width:'1em',height:'1em',}} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#upSVG' ></use></svg></div>
                        <div style={{gridGap:'1em',padding:'10px',opacity:sliderShow?'1':'0',display:sliderShow?'grid':'none',transitionDuration:'0.3s',position:sliderShow?'relative':'absolute'}}>
                            {JSON.parse(JSON.parse(inface.currSettings.obj || '{}').imgArr || '[]').map(d=><div style={{fontWeight:'400',}}>{d.substr(0, 5)}...{d.substr(d.length - 9, 9)}<svg onClick={()=>{setObjProperty('imgArr',JSON.stringify(JSON.parse(JSON.parse(inface.currSettings.obj || '{}').imgArr || '[]').filter(a=>a!==d)),inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{cursor:'pointer',width:'1em',height:'1em',marginLeft:'10px',fill:inface.acolor,verticalAlign:'middle'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg></div>)}
                            <button onClick={()=>{inface.setCurrImageProp('imgArr');document.getElementById('theOnlyOneBody').style.overflow = 'hidden'}} className='niceBtn'>Новый слайд</button>
                            <div>Цвет затенения:<input value={JSON.parse(inface.currSettings.obj || "{}").sliderBackground || '#000000'} onChange={e=>{setObjProperty('sliderBackground',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} type='color'/></div>
                            <div>Прозрачность тени:<input defaultValue={JSON.parse(inface.currSettings.obj || "{}").shadow || 0.5} onChange={e=>{setObjProperty('shadow',parseFloat(e.target.value),inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,}} max='1' step='0.05' min='0' type='number' className='niceShortInput'/></div>
                            <div>Основной цвет:<input value={JSON.parse(inface.currSettings.obj || "{}").sliderColor || '#ffffff'} onChange={e=>{setObjProperty('sliderColor',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} type='color'/></div>
                            <div>Автопрокрутка:<input defaultChecked={JSON.parse(inface.currSettings.obj || "{}").autoScroll === 'false'?false:true} onChange={e=>{setObjProperty('autoScroll',e.target.checked,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{}} type='checkbox'/></div>
                            <div>Открывать на весь экран:<input defaultChecked={JSON.parse(inface.currSettings.obj || "{}").fullScreen === 'true'?true:false} onChange={e=>{setObjProperty('fullScreen',e.target.checked,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{}} type='checkbox'/></div>
                            Прокрутка:<select onChange={e=>setObjProperty('scroll',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])})}  defaultValue={JSON.parse(inface.currSettings.obj || "{}").scroll || 'Зажатием мыши'}>
                                <option>Зажатием мыши</option>
                                <option>Наведением мыши</option>
                                <option>Только кнопками</option>
                            </select><br/>
                            Кнопки:<select onChange={e=>setObjProperty('sliderButtons',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])})}  defaultValue={JSON.parse(inface.currSettings.obj || "{}").sliderButtons || 'Точки'}>
                                <option>Точки</option>
                                <option>Точки под слайдером</option>
                                <option>Слайды</option>
                            </select><br/>
                            <div>Пропорциональная высота:<input defaultChecked={JSON.parse(inface.currSettings.obj || "{}").trueHeight === 'true'?true:false} onChange={e=>{setObjProperty('trueHeight',e.target.checked,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{}} type='checkbox'/></div>

                            <button onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){inface.setCurrText(inface.currSettings)}}} className='niceBtn'>Редактировать текст</button>
                        </div>
                    </div>}
                    {inface.currSettings && inface.currSettings.type !== 'Товар' &&<div style={{position:'relative',width:'calc(100% - 20px)',paddingTop:'1.3em'}}>
                        <div onClick={()=>{setClickShow(!clickShow)}} style={{cursor:'pointer',fontSize:'1.1em',zIndex:'2',position:'relative'}}>Действие при клике<svg style={{transform:clickShow?'rotate(180deg)':'rotate(0)',transitionDuration:'0.3s',top:'2px',right:'0px',position:'absolute',fill:'black',width:'1em',height:'1em',}} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#upSVG' ></use></svg></div>
                        <div style={{gridGap:'1em',padding:'10px',opacity:clickShow?'1':'0',display:clickShow?'grid':'none',transitionDuration:'0.3s',position:clickShow?'relative':'absolute'}}>
                            Внутренняя ссылка:<br/>
                            <select value={JSON.parse(inface.currSettings.obj || '{}').innerLink || 'Нет'} onChange={e=>{setObjProperty('innerLink',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}}>
                                <option>Нет</option>
                                {inface.pages.map(di=>
                                    <option>{(di.title+' '+'страница_'+di.id).substr(0, 34)}</option>
                                )}
                                {inface.blocks.slice().sort((a,b)=>a.id - b.id).map(di=>
                                    <option>{di.type+'_'+di.id}</option>
                                )}
                            </select>
                            Внешняя ссылка:
                            <input defaultValue={JSON.parse(inface.currSettings.obj || "{}").href || ''} onBlur={e=>{setObjProperty('href',e.target.value,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,width:'100%'}} type='text' className='niceInput'/>

                        </div>
                    </div>}
                    {inface.currSettings && inface.currSettings.type !== 'Товар' &&<div style={{fontSize:'1.1em',paddingTop:'1.3em'}}>Анимация:<input checked={JSON.parse(inface.currSettings.obj || "{}").anim === 'true'?true:false} onChange={e=>{setObjProperty('anim',e.target.checked,inface.currSettings.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0])}).catch(d=>alert(d))}} style={{fontWeight:'bold',verticalAlign:'top',padding:'0 3px',fontSize:'0.9em',background:inface.aback,color:inface.acolor,cursor:'pointer'}} type='checkbox'/></div>}
                    {inface.currSettings && (inface.currSettings.type === 'Товар' || inface.currSettings.type === 'Текст') && <button style={{marginTop:'14px'}} onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){inface.setCurrText(inface.currSettings)}}} className='niceBtn'>Редактировать текст</button>}
                </div>}
                <div style={{height:'100px'}}/>
            </div>}
            {user.role > 0 && document.location.pathname.includes(ADMIN_ROUTE) && <button  onClick={()=>{document.getElementById('pageSettingsBG').style.display = 'block';document.getElementById('pageSettings').style.display = 'block';document.getElementById('theOnlyOneBody').style.overflow = 'hidden';}} className="dmnInput" style={{cursor:'pointer',border:'none',color:inface.acolor2,background:'transparent',fontWeight:'bold',zIndex:'1010',display:'block',position:'fixed',right:inface.width > 700?'3em':'3em',top:'0px',padding:'3px 0px',opacity:user.role > 0?'1':'0.4'}}>
            <svg style={{stroke:inface.acolor2,fill:inface.acolor2,width:'2em',height:'2em',}} viewBox="0 0 190 190" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#optionsSVG' ></use></svg>
            </button>}
            {document.location.pathname.includes(ADMIN_ROUTE) &&
            <button ref={dmnBtn} onClick={()=>{if(user.role > 0){logOut()}else{document.getElementById('dmnForm').style.display = 'block'}}} className="dmnInput" style={{cursor:'pointer',border:'none',color:inface.acolor2,background:'transparent',fontWeight:'bold',zIndex:'1010',position:'fixed',right:'8px',top:'0px',padding:'3px 0px',opacity:user.role > 0?'1':'0.4'}}>
                {user.role > 0?<svg style={{stroke:inface.acolor2,fill:inface.acolor2,width:'2em',height:'2em',}} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#exitSVG' ></use></svg>
                :inface.interface.login && 'Вход'}
            </button>}
            {user.role > 0 && document.location.pathname.includes(ADMIN_ROUTE) && <button id='AEBtn' onClick={()=>{document.getElementById('addElementBG').style.display = 'block';document.getElementById('addElement').style.display = 'block';document.getElementById('AEBtn').style.display = 'none';document.getElementById('theOnlyOneBody').style.overflow = 'hidden';}} style={{cursor:'pointer',border:'none',color:inface.acolor2,background:inface.acolor2,fontWeight:'bold',zIndex:'1010',position:'fixed',left:inface.width > 700?'1em':'1em',top:'1px',padding:'6px 6px 4px 6px',borderRadius:'50%'}}>
                <svg style={{stroke:inface.acolor2,fill:'white',width:'2em',height:'2em',}} viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#plusSVG' ></use></svg>
            </button>}
            {user.role > 0 && document.location.pathname.includes(ADMIN_ROUTE) && <div id='addElementBG' style={{zIndex:'1011',width:'100%',height:document.documentElement.clientHeight + 'px',backgroundColor:'black',opacity:'0.5',position:'fixed',top:'0',display:'none'}}/>}
            {user.role > 0 && document.location.pathname.includes(ADMIN_ROUTE) && <div id='addElement' onMouseUp={e=>{if(!document.getElementById('addElementCont').contains(e.target)){
                    document.getElementById('addElementBG').style.display = 'none';
                    document.getElementById('addElement').style.display = 'none';
                    document.getElementById('AEBtn').style.display = 'block';
                    document.getElementById('theOnlyOneBody').style.overflow = 'auto';
                }}} style={{zIndex:'1012',display:'none',position:'fixed',overflow:'auto',width:'100%',bottom:'0',height:document.documentElement.clientHeight + 'px',padding:'0px 0',}}>
                <svg style={{cursor:'pointer',top:'40px',width:'20px',height:'20px',right:'40px',fill:'white',overflow:'hidden',position:'absolute'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>
                <div id='addElementCont' style={{gridGap:'1em',display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderRadius:'10px',margin:'50px 0',padding:document.documentElement.clientWidth > 1000?'30px 60px':'20px',position:'relative',width:document.documentElement.clientWidth > 1000?'1000px':'calc(100% - 40px)',left:document.documentElement.clientWidth > 1000?'calc(50% - 620px)':'0',color:'black',background:'white',fontSize:document.documentElement.clientWidth > 700?'inherit':'13px'}}>
                    <div style={{textAlign:'center',fontWeight:'bold',gridColumn:'1/5'}}>Добавить блок:</div>
                    {inface.typesList.map(d=><div onClick={()=>{document.getElementById('addElementBG').style.display = 'none';document.getElementById('addElement').style.display = 'none';document.getElementById('AEBtn').style.display = 'block';document.getElementById('theOnlyOneBody').style.overflow = 'auto';setTimeout(()=>inface.setBlockType(d),50)}} style={{display:'grid',placeItems:'center',background:'#DEDEDE',height:'100px',borderRadius:'10px',cursor:'pointer'}}>
                        <b>{d}</b>
                    </div>)}
                    <div style={{textAlign:'center',fontWeight:'bold',gridColumn:'1/5'}}>Шаблоны</div>
                    {inface.patterns.map(d=><div onClick={()=>{document.getElementById('addElementBG').style.display = 'none';document.getElementById('addElement').style.display = 'none';document.getElementById('AEBtn').style.display = 'block';document.getElementById('theOnlyOneBody').style.overflow = 'auto';setTimeout(()=>inface.setBlockType('pattern'+d.id),50)}} style={{display:'grid',placeItems:'center',background:'#DEDEDE',height:'100px',borderRadius:'10px',cursor:'pointer'}}>
                        <b>{d.title}</b>
                    </div>)}
                </div>
            </div>}
            {user.role > 0 && document.location.pathname.includes(ADMIN_ROUTE) && <div id='pageSettingsBG' style={{zIndex:'1012',width:'100%',height:document.documentElement.clientHeight + 'px',backgroundColor:'black',opacity:'0.5',position:'fixed',top:'0',display:'none'}}/>}
            {user.role > 0 && document.location.pathname.includes(ADMIN_ROUTE) && <div id='pageSettings' onMouseUp={e=>{if(!document.getElementById('pageSettingsCont').contains(e.target)){
                    document.getElementById('pageSettingsBG').style.display = 'none';
                    document.getElementById('pageSettings').style.display = 'none';
                    document.getElementById('theOnlyOneBody').style.overflow = 'auto';
                }}} style={{zIndex:'1013',display:'none',position:'fixed',overflow:'auto',width:'100%',bottom:'0',height:document.documentElement.clientHeight + 'px',padding:'0px 0',}}>
                <svg style={{cursor:'pointer',top:'40px',width:'20px',height:'20px',right:'40px',fill:'white',overflow:'hidden',position:'absolute'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>
                <div id='pageSettingsCont' style={{display:'grid',gridGap:'1em',justifyItems:'center',borderRadius:'10px',margin:'50px 0',padding:document.documentElement.clientWidth > 1000?'30px 60px':'20px',position:'relative',width:document.documentElement.clientWidth > 1000?'1000px':'calc(100% - 40px)',left:document.documentElement.clientWidth > 1000?'calc(50% - 560px)':'0',color:'black',background:'white',fontSize:document.documentElement.clientWidth > 700?'inherit':'13px'}}>
                    <div style={{textAlign:'center',fontWeight:'bold'}}>Настройки страницы</div><br/>
                    {inface.pages.map(p=>p.id === page.id && <div style={{display:'grid',gridGap:'1em'}}>
                        <div>Название: <input defaultValue={page.title} onBlur={e=>{let form = new FormData();form.append('id',page.id);form.append('property','title');form.append('value',e.target.value);changeSite('setPageProperty',form).then(data=>{inface.setPages(data);setPage(inface.pages.filter(page=>page.path === document.location.pathname.replace(ADMIN_ROUTE,'').replace('/',''))[0])});}} style={{fontWeight:'bold',background:inface.aback,color:inface.acolor,marginRight:'20px',minWidth:'230px'}} className='niceInput'/></div>
                        <div>Путь: <input defaultValue={page.path} onBlur={e=>{let form = new FormData();form.append('id',page.id);form.append('property','path');form.append('value',e.target.value);changeSite('setPageProperty',form).then(data=>{inface.setPages(data);navigate(e.target.value.length?'/'+e.target.value+'/administrator':'/'+e.target.value+'administrator');});}} style={{fontWeight:'bold',background:inface.aback,color:inface.acolor,marginRight:'20px',}} className='niceInput'/></div>
                        <div style={{textAlign:'center'}}>Описание:<br/>
                            <textarea style={{minWidth:'500px'}} rows='6' defaultValue={JSON.parse(page.obj || '{}').description} onBlur={e=>{let obj1 = JSON.parse(page.obj || '{}');obj1.description = e.target.value;let form = new FormData();form.append('id',page.id);form.append('property','obj');form.append('value',JSON.stringify(obj1));changeSite('setPageProperty',form).then(data=>inface.setPages(data));}}></textarea>
                        </div>
                        <div style={{textAlign:'center'}}>Ключевые слова:<br/>
                            <textarea style={{minWidth:'500px'}} rows='6' defaultValue={JSON.parse(page.obj || '{}').keywords} onBlur={e=>{let obj1 = JSON.parse(page.obj || '{}');obj1.keywords = e.target.value;let form = new FormData();form.append('id',page.id);form.append('property','obj');form.append('value',JSON.stringify(obj1));changeSite('setPageProperty',form).then(data=>inface.setPages(data));}}></textarea>
                        </div>
                        <div style={{textAlign:'center'}}>CSS:<br/>
                            <textarea style={{minWidth:'500px'}} rows='6' defaultValue={JSON.parse(page.obj || '{}').css} onBlur={e=>{let obj1 = JSON.parse(page.obj || '{}');obj1.css = e.target.value;let form = new FormData();form.append('id',page.id);form.append('property','obj');form.append('value',JSON.stringify(obj1));changeSite('setPageProperty',form).then(data=>inface.setPages(data));}}></textarea>
                        </div>
                        <div style={{width:'100%',textAlign:'center'}}>JS:<br/>
                            <textarea style={{width:'100%'}} rows='12' defaultValue={JSON.parse(page.obj || '{}').js} onBlur={e=>{let obj1 = JSON.parse(page.obj || '{}');obj1.js = e.target.value;let form = new FormData();form.append('id',page.id);form.append('property','obj');form.append('value',JSON.stringify(obj1));changeSite('setPageProperty',form).then(data=>inface.setPages(data));}}></textarea>
                        </div>
                        <div>Основной цвет:
                            <input defaultValue={JSON.parse(page.obj || '{}').color || '#F94F0D'} onBlur={e=>{let obj1 = JSON.parse(page.obj || '{}');obj1.color = e.target.value;let form = new FormData();form.append('id',page.id);form.append('property','obj');form.append('value',JSON.stringify(obj1));changeSite('setPageProperty',form).then(data=>inface.setPages(data));}} type='color'/>
                        </div>
                        <br/>
                        {inface.pages.length > 1 && <div onClick={()=>{if(['да','lf','l','д'].includes(prompt('Введите "да" если вы действительно хотите безвозвратно удалить эту страницу и все входящие в неё блоки').toLowerCase())){let form = new FormData();form.append('id',page.id);changeSite('removePage',form).then(data=>{inface.setMoveblock('');inface.setPages(data);navigate('../'+data[0].path+ADMIN_ROUTE)})}}} style={{cursor:'pointer',textDecoration:'underline',fontSize:'1.1em',color:'red',}} viewBox="0 0 596 596" xmlns="http://www.w3.org/2000/svg">Удалить страницу</div>}
                    </div>)}
                    <div style={{textAlign:'center',fontWeight:'bold'}}>Настройки сайта:</div>
                    <div>Основной цвет:
                        <input id='mainCI' defaultValue={inface.interface.main || '#FF7300'} onBlur={e=>{setIAttr('main',e.target.value).then(d=>{inface.setInterface(d)}).catch(d=>alert(d))}} type='color'/>
                    </div>
                    <div>Цвет фона:
                        <input id='backCI' defaultValue={inface.interface.background || 'white'} onBlur={e=>{setIAttr('background',e.target.value).then(d=>{inface.setInterface(d)}).catch(d=>alert(d))}} type='color'/>
                    </div>
                    <div>Цвет текста:
                        <input id='fontCI' defaultValue={inface.interface.color || 'black'} onBlur={e=>{setIAttr('color',e.target.value).then(d=>{inface.setInterface(d)}).catch(d=>alert(d))}} type='color'/>
                    </div>
                    <div><b>CSS</b></div>
                    <textarea rel="stylesheet" onBlur={e=>{setIAttr('css',e.target.value).then(d=>{inface.setInterface(d)}).catch(d=>alert(d))}} style={{width:'100%'}} rows='20' defaultValue={inface.interface.css}/>
                    <div><b>JS</b></div>
                    <textarea onBlur={e=>{setIAttr('js',e.target.value).then(d=>{inface.setInterface(d)}).catch(d=>alert(d))}} style={{width:'100%'}} rows='20' defaultValue={inface.interface.js}/>
                    <b>Иконка:</b><br/>
                    {inface.interface.favicon && inface.interface.favicon !== 'null'?<div style={{marginBottom:'3px',marginTop:'13px',display:'inline-block'}}><LazyImage style={{maxWidth:'100px',maxHeight:'100px'}} alt='' src={process.env.REACT_APP_API_URL + inface.interface.favicon}/>{inface.interface.favicon.name ?(inface.interface.favicon.name.length > 19? inface.interface.favicon.name.substr(0,12) + '...' + inface.interface.favicon.name.substr(-7,7):inface.interface.favicon.name):(inface.interface.favicon.length > 19? inface.interface.favicon.substr(0,12) + '...' + inface.interface.favicon.substr(-7,7):inface.interface.favicon)}<LazyImage alt='' style={{cursor:'pointer',width:'19px',height:'19px',marginLeft:'7px'}} src={process.env.REACT_APP_API_URL + "redX.png"} onClick={()=>{setIAttr('favicon',null).then(d=>{inface.setInterface(d)}).catch(d=>alert(d))}}/></div>
                    :<input style={{marginTop:'10px',display:'inline-block'}} onChange={e=>{setIAttr('favicon',e.target.files[0]).then(d=>{inface.setInterface(d)}).catch(d=>alert(d))}}  type="file"/>}<br/><br/>
                    <b>адрес Mail.ru с которого будут отправляться заявки:</b><input onBlur={e=>{setIAttr('mail',e.target.value).then(d=>{inface.setInterface(d)}).catch(d=>alert(d))}} style={{marginLeft:'14px',width:'300px',maxWidth:'90%',marginBottom:'8px'}} type='text' defaultValue={inface.interface.mail}/><br/>
                    <b>Пароль mail.ru для внешнего приложения:</b><input onBlur={e=>{setIAttr('mailPass',e.target.value).then(d=>{inface.setInterface(d)}).catch(d=>alert(d))}} style={{marginLeft:'14px',marginBottom:'8px'}} type='password' defaultValue={inface.interface.mailPass}/><br/>
                    <b>адрес Mail.ru на который будут приходить заявки (можно тот-же, но не рекомендую):</b><input onBlur={e=>{setIAttr('mailToSend',e.target.value).then(d=>{inface.setInterface(d)}).catch(d=>alert(d))}} style={{marginLeft:'14px',width:'300px',maxWidth:'90%',marginBottom:'8px'}} type='text' defaultValue={inface.interface.mailToSend}/><br/>

                </div>
            </div>}
            {inface.interface.login && document.location.pathname.includes(ADMIN_ROUTE) && <div id='dmnForm' ref={dmnLogin} style={{border:'1px grey solid',color:'black',background:'white',zIndex:'1011',position:'fixed',display:'none',width:inface.width > 300?'300px':'100%',height:'32cd0px',left:inface.width > 300?'calc(50% - 150px)':'0',top:inface.height / 2 - 150 + 'px'}}>
                <svg onClick={()=>dmnLogin.current.style.display='none'} style={{width:'15px',height:'15px',position:'absolute',right:'10px',top:'0px',cursor:'pointer',fill:'grey',overflow:'hidden'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>
                <div style={{color:'black',fontWeight:'bold'}} className='textDN'>Login</div>
                <input style={{border:'1px grey solid',borderRadius:'5px',background:'transparent',color:'black',}} autoComplete='off' id='dmnLog' onChange={e=>{setLogin(e.target.value)}} value={login} className="dmnInput" type="text"/><br/>
                <div style={{color:'black',fontWeight:'bold'}} className='textDN'>Password</div>
                <input style={{border:'1px grey solid',borderRadius:'5px',background:'transparent',color:'black',}} id='dmnPass' onChange={e=>{setPassword(e.target.value)}} value={password} className="dmnInput" type="password"/><br/>
                <button style={{border:'1px #1576FF solid',borderRadius:'5px',width:'200px',margin:'30px 30px 50px 30px',color:'white',background:'#1576FF'}} onClick={()=>{checkBtn()}} id="dmnLogBtn" type="submit">Войти</button><br/>
            </div>}

            <div style={{position:'relative',display:'grid',width:'100%',justifyItems:'center'}}>
                {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)?<div style={{zIndex:'1009',position:'relative',display:'grid',justifyItems:'center',gridAutoFlow:'column',alignItems:'center',fontWeight:'bold',width:'calc(100% - 30px)',textAlign:'center',padding:'5px 15px',color:inface.aback,background:inface.acolor,}}>
                    <div>
                        Страница: <select value={page.title} onChange={e=>{inface.setMoveblock('');if(e.target.value === 'Новая страница'){changeSite('addPage').then(data=>{inface.setPages(data.pages);navigate('../'+data.path + ADMIN_ROUTE);})}else{navigate('../'+inface.pages.filter(page=>page.title === e.target.value)[0].path + ADMIN_ROUTE)}}} style={{fontWeight:'bold',background:inface.aback,color:inface.acolor,marginRight:'20px'}}>
                        {inface.pages.slice().sort().map(d=><option key={d.title}>{d.title}</option>)}
                            <option>Новая страница</option>
                        </select>
                    </div>
                </div>:null}
                <div id={'page'+page.id} style={{minHeight:'2fr',justifyItems:'stretch',display:"grid",width:'100%',position:'relative'}}>
                    <style>{JSON.parse(page.obj || '{}').css}</style>
                    {inface.blocks.slice().sort((a,b)=>a.priority-b.priority).map((d,key)=>d.parent === 'page'+page.id &&<Distrib data={d}/>)}
                    {user.role > 3 && (inface.moveblock === '' || inface.moveblock === 'page'+page.id) && inface.blockType &&<div style={{width:'100%',position:'relative',display:'grid',placeItems:'center',}}>
                        <div style={{background:inface.acolor2 || inface.acolor2,width:'100%',height:'4px',top:'0',gridRow:'1/2',gridColumn:'1/2',borderRadius:'4px'}}></div>
                        <div style={{fontWeight:'bold',background:inface.acolor2 || inface.acolor2,color:'white',gridRow:'1/2',gridColumn:'1/2',borderRadius:'4px',padding:'0 8px'}}>Поместить сюда</div>
                    </div>}
                </div>
            </div>
            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && inface.currText.id &&<div style={{position:'fixed',top:'120px',left:'20%',display:'grid',zIndex:'1011',}}>
                <div onClick={()=>inface.setCurrText({})} style={{width:'100%',height:document.documentElement.clientHeight + 'px',backgroundColor:'black',opacity:'0.5',position:'fixed',top:'0',left:'0',display:'block'}}/>
                <Editor
                    apiKey='3hgh0lh5euqgmlarql66lcizcd26ho2bhecnji42flbhyoue'
                    onInit={(evt, editor) => editorRef.current = editor}
                    initialValue={JSON.parse(inface.currText.obj || '{}').text || ''}
                    init={{
                    height:inface.height - 240,
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
                    content_style: 'body {font-size:'+(JSON.parse(inface.currText.obj || "{}").fontSize || 1)+'em }'
                    }}
                />
                <button style={{zIndex:'2',justifySelf:'center',fontSize:'1.2em',fontWeight:'600',color:inface.acolor,background:inface.aback,marginTop:'5px',padding:'10px 50px',border:'1px '+inface.acolor+' solid',borderRadius:'10px',cursor:'pointer'}} onClick={()=>{if(editorRef.current){setObjProperty('text',editorRef.current.getContent(),inface.currText.id).then(d=>{inface.setBlocks(d);inface.setCurrSettings(d.filter(d=>d.id === inface.currSettings.id)[0]);inface.setCurrText({});}).catch(d=>alert(d))}}}>Сохранить</button>
            </div>}
            {user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE) && inface.currImageProp &&<div style={{overflowY:'auto',width:inface.width * 0.8 + 'px',height:inface.height + 'px',position:'fixed',top:'0px',left:'0',display:'block',zIndex:'1011',padding:'0% '+(inface.width * 0.1) + 'px',}}>
                <div onClick={()=>{inface.setCurrImageProp(null);document.getElementById('theOnlyOneBody').style.overflow = 'auto'}} style={{width:'100%',height:document.documentElement.clientHeight + 'px',backgroundColor:'black',opacity:'0.5',position:'fixed',top:'0px',left:'0',display:'block'}}/>
                <div style={{overflowY:'hidden',margin:'7% 0',justifyItems:'center',gridGap:'1em',display:'grid',gridTemplateRows:'min-content min-content 1fr',background:inface.aback,zIndex:'2',width:'calc(100% - 60px)',minHeight:'100%',padding:'30px',borderRadius:'15px',position:'relative',}}>
                    <h3>Файлы</h3>
                    <div>Загрузить новый файл:<input style={{width:'9em',}} onChange={e=>{let form = new FormData();form.append('file',e.target.files[0]);changeSite('addImage',form).then(data=>{inface.setImages(data);}).catch(d=>alert(d))}} type='file'/></div>
                    <div style={{position:'relative',width:'100%',gridGap:'1em',display:'grid',gridTemplateColumns:'repeat(4,1fr)'}}>
                        {inface.images.slice().reverse().map((d,key)=><div key={'uploadImg'+d.id} style={{display:'grid',gridGap:'1em',width:'100%',placeItems:'center',position:'relative'}}>
                            <div style={{fontWeight:'300',fontSize:'0.63em'}}>{d.path}<svg onClick={()=>{let form = new FormData();form.append('id',d.id);changeSite('removeImage',form).then(data=>{inface.setImages(data.images);inface.setBlocks(data.blocks)}).catch(d=>alert(d))}} style={{width:'15px',height:'15px',top:'5px',position:'relative',paddingLeft:'10px',cursor:'pointer',fill:'grey',overflow:'hidden'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg></div>
                            <LazyImage onClick={()=>{let val = null;if(inface.currImageProp.toLowerCase().includes('arr')){let arr1 = JSON.parse(JSON.parse(inface.currSettings.obj || '{}').imgArr || '[]');arr1.push(d.path);val = JSON.stringify(arr1)}else{val = d.path};setObjProperty(inface.currImageProp,val,inface.currSettings.id).then(data=>{inface.setBlocks(data);inface.setCurrSettings(data.filter(d=>d.id === inface.currSettings.id)[0]);inface.setCurrImageProp(null);document.getElementById('theOnlyOneBody').style.overflow = 'auto'})}} style={{objectFit:'contain',maxWidth:'100%',maxHeight:'250px',minHeight:'150px',borderRadius:'10px',cursor:'pointer',alignSelf:'start'}} src={process.env.REACT_APP_API_URL + d.path}/>
                        </div>)}
                    </div>
                </div>
            </div>}
            <div style={{zIndex:'15',left:'0',top:'0',display:inface.currImages.length?'grid':'none',width:'100%',height:inface.height+'px',position:'fixed',}} onMouseDown={e=>{if(!document.getElementById('BVI').contains(e.target) && !document.getElementById('prevBVI').contains(e.target) && !document.getElementById('nextBVI').contains(e.target)){inface.setCurrImages([]);inface.setCurrImage(null)}}}>
                <div style={{gridRow:'1/2',gridColumn:'1/2',background:'black',opacity:'0.6',}}/>
                <div style={{gridRow:'1/2',gridColumn:'1/2',gridTemplateRows:inface.height+'px',placeSelf:'center',width:'95%',display:'grid',placeItems:'center',height:inface.height+'px',position:'relative'}}>
                    <svg onClick={()=>{inface.setCurrImage(null);inface.setCurrImages([])}} style={{cursor:'pointer',top:'20px',width:'20px',height:'20px',right:'-2%',fill:'white',overflow:'hidden',position:'absolute'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>
                    {inface.currImages.map(d=><LazyImage id='BVI' src={process.env.REACT_APP_API_URL + d} style={{display:d === inface.currImages[inface.currImage]?'block':'none',maxWidth:'100%',minWidth:'30%',minHeight:'30%',alignSelf:'center',maxHeight:'95%'}} alt=''/>)}
                </div>
                <svg id='prevBVI' onClick={()=>{if(inface.currImage > 0){inface.setCurrImage(inface.currImage - 1)}}} style={{opacity:inface.currImage > 0?'0.6':'0',cursor:inface.currImage > 0?'pointer':'default',top:inface.width > 900?inface.height / 2 - 30 + 'px':inface.height / 2 - 15 + 'px',width:inface.width > 900?'60px':'30px',transform:'rotate(-90deg)',height:inface.width > 900?'60px':'30px',left:'0.5%',fill:'grey',background:'white',borderRadius:'50%',padding:'5px',overflow:'hidden',position:'absolute'}} viewBox="-38 -30 250 250" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
                <svg id='nextBVI' onClick={()=>{if(inface.currImage < inface.currImages.length - 1){inface.setCurrImage(inface.currImage + 1)}}} style={{opacity:inface.currImage < inface.currImages.length - 1?'0.6':'0',cursor:inface.currImage < inface.currImages.length - 1?'pointer':'default',top:inface.width > 900?inface.height / 2 - 30 + 'px':inface.height / 2 - 15 + 'px',width:inface.width > 900?'60px':'30px',transform:'rotate(90deg)',height:inface.width > 900?'60px':'30px',right:'0.5%',fill:'grey',background:'white',borderRadius:'50%',padding:'5px',overflow:'hidden',position:'absolute'}} viewBox="-38 -30 250 250" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#arrowSVG' ></use></svg>
            </div>
            <div id={'productBG'} onClick={()=>{document.getElementById('theOnlyOneBody').style.overflow = 'auto';inface.setCurrProduct(null)}} style={{zIndex:'1012',width:'100%',height:document.documentElement.clientHeight + 'px',backgroundColor:'black',opacity:'0.5',position:'fixed',top:'0',display:inface.currProduct?'block':'none'}}/>
            <div id={'product'} onMouseUp={e=>{if(!document.getElementById('productCont').contains(e.target)){document.getElementById('theOnlyOneBody').style.overflow = 'auto';inface.setCurrProduct(null);setProdCount(1);}}} style={{zIndex:'1013',display:inface.currProduct?'block':'none',position:'fixed',overflow:'auto',width:'100%',bottom:'0',height:document.documentElement.clientHeight + 'px',padding:'0px 0',}}>
                <svg style={{cursor:'pointer',top:'40px',width:'20px',height:'20px',right:'40px',fill:'white',overflow:'hidden',position:'fixed'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>
                <div id={'productCont'} style={{display:'grid',gridGap:'1em',justifyItems:'center',borderRadius:'10px',margin:'70px 0',padding:document.documentElement.clientWidth > 1000?'30px 30px':'20px',position:'relative',width:document.documentElement.clientWidth > 800?'800px':'calc(100% - 40px)',left:document.documentElement.clientWidth > 800?'calc(50% - 430px)':'0',color:'black',background:'white',fontSize:document.documentElement.clientWidth > 700?'inherit':'13px'}}>
                    {inface.currProduct && <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gridGap:'1em',width:'100%'}}>
                        <LazyImage style={{objectFit:'contain',height:'280px',width:'100%'}} src={process.env.REACT_APP_API_URL + JSON.parse(inface.currProduct.obj || "{}").background} alt=''/>
                        <div style={{display:'grid',alignItems:'center'}}>
                            <h3 style={{textAlign:'center',marginBottom:'1em'}}>{JSON.parse(inface.currProduct.obj || "{}").title}</h3>
                            <div style={{fontSize:'1.1em',textAlign:'center'}}><b>{JSON.parse(inface.currProduct.obj || "{}").price && JSON.parse(inface.currProduct.obj || "{}").price.length > 0 && JSON.parse(inface.currProduct.obj || "{}").price}</b> руб.</div>
                            <div style={{placeSelf:"center"}} className='noselect'>
                                <div onClick={()=>{if(prodCount > 1){setProdCount(prodCount - 1)}}} style={{cursor:'pointer',padding:'16px 14px 21px 14px',fontWeight:'bold',fontSize:'1.8em',lineHeight:'0',borderRadius:'50%',boxShadow:'0 1px 14px 1px rgb(0 0 0 / 10%)',display:'inline-block',background:'white'}}>-</div>
                                <span style={{fontSize:'1.6em',margin:'0 20px'}}>{prodCount} шт.</span>
                                <div onClick={()=>{setProdCount(prodCount + 1)}} style={{cursor:'pointer',padding:'17px 10px 20px 10px',fontWeight:'bold',fontSize:'1.8em',lineHeight:'0',borderRadius:'50%',boxShadow:'0 1px 14px 1px rgb(0 0 0 / 10%)',display:'inline-block',background:'white'}}>+</div>
                            </div>
                            <button onClick={()=>{setProdCount(1);let arr = inface.basket;for(let i = 0;i < prodCount;i++){arr.push(inface.currProduct.id)};inface.setBasket(arr);document.getElementById('theOnlyOneBody').style.overflow = 'auto';inface.setCurrProduct(null)}} style={{cursor:'pointer',width:'100%',border:'none',color:'white',fontWeight:'600',padding:'7px 10px',fontSize:'1em',borderRadius:'15px',background:'#F94F0D',}}>Добавить | {JSON.parse(inface.currProduct.obj || "{}").price && JSON.parse(inface.currProduct.obj || "{}").price.length > 0 && JSON.parse(inface.currProduct.obj || "{}").price * prodCount} руб.</button>
                        </div>
                    </div>}
                    {inface.currProduct && <div>
                        <div style={{fontSize:'0.95em',marginTop:'7px',}}><div  dangerouslySetInnerHTML={{__html:JSON.parse(inface.currProduct.obj || '{}').text || ''}}/></div>
                        <br/>
                    </div>}
                </div>
            </div>
            {inface.basket.length && cost > 0 && <div style={{position:'fixed',cursor:'pointer',display:'grid',gridTemplateColumns:'1fr 1fr',bottom:'1em',left:'calc(50% - 300px - 1em)',background:JSON.parse(page.obj || '{}').color || '#F94F0D',color:'white',maxWidth:'100%',width:'600px',padding:'0.7em 1em',fontSize:'1.3em',fontWeight:'bold',borderRadius:'40px',}}>
                <div>Оформить заказ</div><div style={{textAlign:'right'}}> <span style={{fontWeight:'400'}}>{cost} руб.</span></div>
            </div>}
        </div>
    );
});
export default MainPage;