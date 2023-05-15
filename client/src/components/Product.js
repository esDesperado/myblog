import React, {useContext} from 'react';
import {Context} from '../index';
import {observer} from "mobx-react-lite";
import LazyImage from "./LazyImage";

const Block = observer((data,v) => {
    const {inface} = useContext(Context)
    data = data.data
    return(<div style={{minHeight:'100%',cursor:'default',borderRadius:'10px',overflow:'hidden',width:'100%',boxShadow:'0 3px 5px 0 rgb(0 0 0 / 8%)',position:'relative'}}>
        <LazyImage onClick={()=>{inface.setCurrProduct(data);document.getElementById('theOnlyOneBody').style.overflow = 'hidden';}} style={{objectFit:'contain',width:'100%',maxHeight:'280px',minHeight:'120px'}} src={process.env.REACT_APP_API_URL + JSON.parse(data.obj || "{}").background} alt=''/>
        <div style={{padding:'50px 1em 60px 1em'}}>
            <h4 onClick={()=>{inface.setCurrProduct(data);document.getElementById('theOnlyOneBody').style.overflow = 'hidden';}}>{JSON.parse(data.obj || "{}").title}</h4>
            <div onClick={()=>{inface.setCurrProduct(data);document.getElementById('theOnlyOneBody').style.overflow = 'hidden';}} style={{fontSize:'0.95em',marginTop:'7px',display:'-webkit-box',WebkitLineClamp:'3',WebkitBoxOrient:'vertical',overflow:'hidden'}}><div  dangerouslySetInnerHTML={{__html:JSON.parse(data.obj || '{}').text || ''}}/></div>
        </div>
        {JSON.parse(data.obj || "{}").price && JSON.parse(data.obj || "{}").price.length > 0 &&<div onClick={()=>{inface.setCurrProduct(data);document.getElementById('theOnlyOneBody').style.overflow = 'hidden';}} style={{position:'absolute',left:'1em',bottom:'1.5em',}}><b style={{fontSize:"1.25em"}}>{JSON.parse(data.obj || "{}").price}</b> руб.</div>}
        {inface.basket.includes(data.id)?
        <div style={{padding:'12px',position:'absolute',right:'0em',bottom:'0em',}} className='noselect'>
            <div onClick={()=>{let arr = inface.basket;arr.splice(arr.indexOf(data.id),1);inface.setBasket(arr)}} style={{cursor:'pointer',padding:'16px 14px 21px 14px',fontWeight:'bold',fontSize:'1.8em',lineHeight:'0',borderRadius:'50%',boxShadow:'0 1px 14px 1px rgb(0 0 0 / 10%)',display:'inline-block',background:'white'}}>-</div>
            <span style={{fontSize:'1.6em',margin:'0 20px'}}>{inface.basket.filter(d=>d === data.id).length} шт.</span>
            <div onClick={()=>{let arr = inface.basket;arr.push(data.id);inface.setBasket(arr)}} style={{cursor:'pointer',padding:'17px 10px 20px 10px',fontWeight:'bold',fontSize:'1.8em',lineHeight:'0',borderRadius:'50%',boxShadow:'0 1px 14px 1px rgb(0 0 0 / 10%)',display:'inline-block',background:'white'}}>+</div>
        </div>:
        <div onClick={()=>{let arr = inface.basket;arr.push(data.id);inface.setBasket(arr)}} style={{padding:'12px',position:'absolute',right:'1em',bottom:'0.5em',borderRadius:'50%',background:'#F94F0D',display:'grid',placeItems:'center',cursor:'pointer'}}><svg style={{stroke:'#F77300',fill:'white',width:'1.5em',height:'1.5em',}} viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#plusSVG' ></use></svg></div>}
    </div>)
});
export default Block;