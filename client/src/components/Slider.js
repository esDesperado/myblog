import React, {useContext,useState,useEffect,useRef} from 'react';
import {Context} from '../index';
import {observer} from "mobx-react-lite";
import {ADMIN_ROUTE} from "../utils/consts";
import LazyImage from "./LazyImage";

const PostHeader = observer((data,v) => {
    const {user,inface} = useContext(Context)
    data = data.data
    v = data.variation
    const [CS, setCS] = useState(0)
    const [CL,setCL] = useState(2)
    const [SC,setSC] = useState(true)
    const [sliderTime,setSliderTime] = useState(7000)
    useEffect(()=>{
        if((user.role < 4 || !document.location.pathname.includes(ADMIN_ROUTE)) && CL > 1 && SC && JSON.parse(data.obj || "{}").autoScroll !== 'false'){
            const sliderTimer = setTimeout(()=>{
                setSliderTime(7000)
                document.getElementById('slider'+data.id).style.transitionDuration = '0.7s';
                setCS(CS + 1);
                if(CS >= CL - 1){
                    const timer = setTimeout(()=>{
                        setSliderTime(6300)
                        document.getElementById('slider'+data.id).style.transitionDuration = '0s'
                        setCS(0)
                    },700)
                    return () => clearTimeout(timer)
                }
            },sliderTime)
            return () => clearTimeout(sliderTimer)
        }else{}
    }, [sliderTime,CS,CL,SC])
    const [CLI,setCLI] = useState([])
    useEffect(()=>{
        if(JSON.stringify(CLI) !== (JSON.parse(data.obj || '{}').imgArr || '[]')){
            setCLI(JSON.parse(JSON.parse(data.obj || '{}').imgArr || '[]'))
        }
    },[data.obj,CLI])
    useEffect(()=>{
        if(CL !== CLI.length){setCL(CLI.length)}
    },[CLI])
    const [touch,setTouch] = useState(false)
    const [mTouch,setMTouch] = useState(false)
    let startTranslate = 0
    let EW, EL
    if(document.getElementById('slider'+data.id)){startTranslate = parseInt(window.getComputedStyle(document.getElementById('slider'+data.id),'').transform.split(/\(|,\s|\)/).slice(1,7)[4])}
    useEffect(()=>{
        if(touch){
            setSC(false)
            if(EW !== w1){
                EW = w1
            }
            if(EL !== 0){
                EL = 0
            }
            let k = 1.5
            function a(e){
                document.getElementById('slider'+data.id).style.transitionDuration = '0s'
                if((e.pageX - EL - touch) * k + startTranslate > EW / 2){
                    document.getElementById('slider'+data.id).style.transform = 'translateX('+((e.pageX - EL - touch) * k + startTranslate - EW * (CL))+'px)'
                }else if((e.pageX - EL - touch) * k + startTranslate < - EW * (CL - 0.5)){
                    document.getElementById('slider'+data.id).style.transform = 'translateX('+((e.pageX - EL - touch) * k + startTranslate + EW * (CL))+'px)'
                }else{
                    document.getElementById('slider'+data.id).style.transform = 'translateX('+((e.pageX - EL - touch) * k + startTranslate)+'px)'
                }
            }
            document.addEventListener('mousemove',a)
            document.addEventListener('mouseup',e=>{
                document.removeEventListener('mousemove',a);
                setTouch(false)
                setSC(true)
                setSliderTime(11000)
                document.getElementById('slider'+data.id).style.transitionDuration = '0.7s'
                setCS(Math.ceil((parseInt(document.getElementById('slider'+data.id).style.transform.replace('translateX(','').replace('px)','')) + EW / 2 ) / - EW))
                document.getElementById('slider'+data.id).style.transform = 'translateX('+(EW * Math.ceil((parseInt(document.getElementById('slider'+data.id).style.transform.replace('translateX(','').replace('px)','')) - EW / 2 ) / EW))+'px)'
            })
        }
        if(mTouch){
            setSC(false)
            if(EW !== w1){
                EW = w1
            }
            if(EL !== 0){
                EL = 0
            }
            let k = 1.5
            function a(e){
                document.getElementById('slider'+data.id).style.transitionDuration = '0s'
                if((e.targetTouches[0].pageX - EL - mTouch) * k + startTranslate > EW / 2){
                    document.getElementById('slider'+data.id).style.transform = 'translateX('+((e.targetTouches[0].pageX - EL - mTouch) * k + startTranslate - EW * (CL))+'px)'
                }else if((e.targetTouches[0].pageX - EL - mTouch) * k + startTranslate < - EW * (CL - 0.5)){
                    document.getElementById('slider'+data.id).style.transform = 'translateX('+((e.targetTouches[0].pageX - EL - mTouch) * k + startTranslate + EW * (CL))+'px)'
                }else{
                    document.getElementById('slider'+data.id).style.transform = 'translateX('+((e.targetTouches[0].pageX - EL - mTouch) * k + startTranslate)+'px)'
                }
            }
            document.addEventListener('touchmove',a)
            document.addEventListener('touchend',e=>{
                document.removeEventListener('touchmove',a);
                setMTouch(false)
                setSC(true)
                setSliderTime(11000)
                document.getElementById('slider'+data.id).style.transitionDuration = '0.7s'
                setCS(Math.ceil((parseInt(document.getElementById('slider'+data.id).style.transform.replace('translateX(','').replace('px)','')) + EW / 2 ) / - EW))
                document.getElementById('slider'+data.id).style.transform = 'translateX('+(EW * Math.ceil((parseInt(document.getElementById('slider'+data.id).style.transform.replace('translateX(','').replace('px)','')) - EW / 2 ) / EW))+'px)'
            })
        }
    },[touch,mTouch])
    const editorRef = useRef(0);
    const [h1,setH1] = useState(inface.height)
    const [w1,setW1] = useState(inface.width)
    useEffect(()=>{
        if(document.getElementById('block'+data.id) && (h1 !== document.getElementById('block'+data.id).getBoundingClientRect().height || w1 !== document.getElementById('block'+data.id).getBoundingClientRect().width)){
            if(document.getElementById('sl'+data.id+'CoI0')){document.getElementById('sl'+data.id+'CoI0').style.transitionDuration = '0s'}
            setW1(document.getElementById('block'+data.id).getBoundingClientRect().width)
            setH1(JSON.parse(data.obj || "{}").trueHeight === 'true'?document.getElementById('block'+data.id).getBoundingClientRect().width / 16 * 9:document.getElementById('block'+data.id).getBoundingClientRect().height)
            if(document.getElementById('sl'+data.id+'CoI0')){document.getElementById('sl'+data.id+'CoI0').style.transitionDuration = '12s'}
        }
    },[h1,w1,document.getElementById('block'+data.id),document.getElementById('block'+data.id) && document.getElementById('block'+data.id).getBoundingClientRect().width,inface.width])
    if(JSON.parse(data.obj || "{}").scroll === 'Наведением мыши' && document.getElementById('sliderContainer'+data.id)){
        let block = document.getElementById('sliderContainer'+data.id).getBoundingClientRect()
        document.getElementById('sliderContainer'+data.id).addEventListener('mousemove',e=>{
            if(CS !== Math.floor((e.pageX - block.left) / (block.width / CLI.length))){setCS(Math.floor((e.pageX - block.left) / (block.width / CLI.length)))}
        })
    }
    return(
    <div style={{}}>
        <div id={'sliderContainer' + data.id} onMouseDown={e=>{if((!JSON.parse(data.obj || "{}").scroll || JSON.parse(data.obj || "{}").scroll === 'Зажатием мыши') && (user.role < 4 || !document.location.pathname.includes(ADMIN_ROUTE))){setTouch(e.pageX)}}} onTouchStart={e=>{if((JSON.parse(data.obj || "{}").scroll || 'Зажатием мыши') === 'Зажатием мыши' && (user.role < 4 || !document.location.pathname.includes(ADMIN_ROUTE))){setMTouch(e.targetTouches[0].pageX)}}} onClick={()=>{if((!user.role > 3 || !document.location.pathname.includes(ADMIN_ROUTE)) && JSON.parse(data.obj || "{}").fullScreen === 'true'){inface.setCurrImages(CLI);inface.setCurrImage(CS);}}} className='US' style={{transitionProperty:'transform,opacity',background:(JSON.parse(data.obj || '{}').sliderBackground || '#000000') + (JSON.parse(data.obj || "{}").shadow !== null?JSON.parse(data.obj || "{}").shadow * 255:0.5 * 255).toString(16).split('.')[0],color:JSON.parse(data.obj || "{}").sliderColor || 'inherit',display:'grid',gridGap:'0',gridTemplateColumns:'100%',zIndex:'1',position:'absolute',width:!inface.mobile?'80%':'calc(100% - 20px)',padding:!inface.mobile?'90px 10% 90px 10%':'50px 10px',height:!inface.mobile?h1 - 180 + 'px':h1 - 100 + 'px',placeItems:'center',fontSize:(JSON.parse(data.obj || "{}").fontSize || 1)+'em',cursor:(!user.role > 3 || !document.location.pathname.includes(ADMIN_ROUTE)) && JSON.parse(data.obj || "{}").fullScreen === 'true'?'pointer':'default'}}>
            <div className={JSON.parse(data.obj || "{}").anim?'FDAStart':'FDAEnd'} onClick={()=>{if(user.role > 3 && document.location.pathname.includes(ADMIN_ROUTE)){inface.setCurrText(data)}}} style={{width:'100%',height:'auto'}} dangerouslySetInnerHTML={{__html:JSON.parse(data.obj || '{}').text || ''}}/>
        </div>
        <div style={{position:'relative',width:'100%',height:h1 + 'px',overflow:'hidden',}}>
            <div id={'slider'+data.id} style={{transform:'translateX(' + -(w1 * (CS)) + 'px)',transitionProperty:'transform',transitionDuration:JSON.parse(data.obj || "{}").scroll === 'Наведением мыши'?'0s':'1.3s',left:(JSON.parse(data.obj || "{}").scroll || 'Зажатием мыши') === 'Зажатием мыши'?-(w1 * (CL > 0?CL > 1?CL > 2?2:2:1:0)) + 'px':'0',gridTemplateColumns:(JSON.parse(data.obj || "{}").scroll || 'Зажатием мыши') === 'Зажатием мыши'?'repeat('+(CL + 4)+', '+w1+'px)':'repeat('+CL+', '+w1+'px)',gridTemplateRows:'100%',position:'absolute',top:'0',minWidth:'100%',height:!inface.phm > 0?h1 - inface.hh + 'px':h1 + 'px',display:'grid',}}>
                {(JSON.parse(data.obj || "{}").scroll || 'Зажатием мыши') === 'Зажатием мыши' && CLI.map((d,key)=>key > CLI.length - 3 &&
                <div style={{display:'grid',width:w1 + 'px',height:'100%',position:'relative',overflow:'hidden'}}>
                    <LazyImage style={{width:'100%',height:'100%',objectFit:'cover'}} src={process.env.REACT_APP_API_URL + d} alt=''/>
                </div>)}
                {CLI.map((d,key)=>{
                    if(document.getElementById('sl'+data.id+'CoI'+key) && JSON.parse(data.obj || "{}").autoScroll !== 'false'){
                        if(CS === key){
                            document.getElementById('sl'+data.id+'CoI'+key).style.transform = 'scale(100%)'
                            document.getElementById('sl'+data.id+'CoI'+key).style.transitionDuration = '12s'
                            setTimeout(()=>document.getElementById('sl'+data.id+'CoI'+key).style.transform = 'scale(122%)',key === 0?0:600)
                        }else{
                            document.getElementById('sl'+data.id+'CoI'+key).style.transitionDuration = '5s'
                            document.getElementById('sl'+data.id+'CoI'+key).style.transform = 'scale(100%)'
                        }
                    }
                    return(
                    <div style={{display:'grid',width:w1 + 'px',height:'100%',position:'relative',overflow:'hidden'}}>
                        <LazyImage id={'sl'+data.id+'CoI'+key}  style={{width:'100%',height:'100%',objectFit:'cover'}} src={process.env.REACT_APP_API_URL + d} alt=''/>
                    </div>
                    )
                })}
                {(JSON.parse(data.obj || "{}").scroll || 'Зажатием мыши') === 'Зажатием мыши' && CLI.map((d,key)=>key < 2 &&
                <div style={{display:'grid',width:w1 + 'px',height:'100%',position:'relative',overflow:'hidden'}}>
                    <LazyImage  style={{width:'100%',height:'100%',objectFit:'cover'}} src={process.env.REACT_APP_API_URL + d} alt=''/>
                </div>)}
            </div>
        </div>
        {JSON.parse(data.obj || "{}").sliderButtons === 'Слайды'?<div style={{textAlign:'center',width:w1+'px',position:'absolute',bottom:-(w1 / 8 / 16 * 9) + 'px'}}>
            <div style={{boxShadow:!inface.mobile?'inset 0px 0px 20px 5px '+(JSON.parse(data.obj || "{}").sliderColor || '#ffffff'):'inset 0px 0px 3px 1px '+(JSON.parse(data.obj || "{}").sliderColor || '#ffffff'),transform:CS < 0?'translateX('+((CL - 1) * w1 / 8 - w1 * Math.floor((CL - 1) / 8)) + 'px) translateY(' + (Math.floor((CL - 1) / 8) * w1 / 8 / 16 * 9) + 'px)':CS < CL?'translateX('+(CS * w1 / 8 - w1 * Math.floor(CS / 8)) + 'px) translateY(' + (Math.floor(CS / 8) * w1 / 8 / 16 * 9) + 'px)':'translateX(0px) translateY(0px)',border:!inface.mobile?'3px '+(JSON.parse(data.obj || "{}").sliderColor || '#ffffff')+' solid':'1px '+(JSON.parse(data.obj || "{}").sliderColor || '#ffffff')+' solid',height:w1 / 8 / 16 * 9 + 'px',outline:'none',margin:'none',width:inface.mobile?w1 / 8 - 2 + 'px':w1 / 8 - 4 + 'px',zIndex:'2',top:'0',left:'0',position:'absolute',transitionDuration:'0.6s'}}/>
            {CL > 1 && CLI.map((d,key)=>
            <div style={{zIndex:'1',position:'relative',overflow:'hidden',width:w1 / 8 + 'px',height:w1 / 8 / 16 * 9 + 'px',display:'grid',float:'left',cursor:'pointer',transitionDuration:'0.8s'}} onClick={()=>{setSliderTime(11000);setCS(key)}}>
                <LazyImage  style={{width:'100%',height:'100%',objectFit:'cover'}} src={process.env.REACT_APP_API_URL + d}/>
            </div>)}
        </div>:
        <div style={{textAlign:'center',width:'100%',position:'absolute',zIndex:'3',bottom:JSON.parse(data.obj || "{}").sliderButtons === 'Точки под слайдером'?'-20%':'7%'}}>
            {CL > 1 && CLI.map((d,key)=><div onClick={()=>{setSliderTime(11000);setCS(key)}} style={{background:CS === key?JSON.parse(data.obj || "{}").sliderColor || '#ffffff':(data.sliderBackground || '#000000') + '11',border:'1px '+(JSON.parse(data.obj || "{}").sliderColor || '#ffffff')+' solid',width:inface.mobile?'9px':'12px',height:inface.mobile?'9px':'12px',margin:inface.mobile?'0 4px':'0 7px',borderRadius:'50%',display:'inline-block',cursor:'pointer',transitionDuration:JSON.parse(data.obj || "{}").scroll === 'Наведением мыши'?'0s':'0.8s'}}></div>)}
        </div>}
    </div>
    );
});
export default PostHeader;