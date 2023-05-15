import React, {useContext,useState,useEffect} from 'react';
import {Context} from '../index';
import {observer} from "mobx-react-lite";
import Distrib from "./Distrib"
const Block = observer((data,v) => {
    const {inface} = useContext(Context)
    data = data.data
    let [category,setCategory] = useState("")
    let [categories,setCategories] = useState([])
    useEffect(()=>{
        let arr2 = []
        inface.blocks.map(d=>{
            if(d.type === 'Товар' && JSON.parse(d.obj || "{}").category && !arr2.includes(JSON.parse(d.obj || "{}").category)){
                arr2.push(JSON.parse(d.obj || "{}").category)
            }
            return true
        })
        if(!inface.category.length){inface.setCategory(arr2[0])}
        if(!category.length){setCategory(arr2[0])}
        if(JSON.stringify(arr2) !== JSON.stringify(categories)){setCategories(arr2)}
    },[JSON.stringify(inface.blocks),categories,category.length,inface])
    return(
    <div style={{display:'grid',gridTemplateColumns:'1fr 3fr',gridGap:'1em'}}>
        <div className='noselect' style={{background:'#F7F7F7',borderRadius:'7px',padding:'1em',alignSelf:'start'}}>
            {categories.map((d,key)=>
            <div key={'cat'+d} style={{boxShadow:(category === "" && key === 0) || category === d?'0 1px 6px 2px rgb(0 0 0 / 6%)':'none',background:(category === "" && key === 0) || category === d?'white':'transparent',fontWeight:(category === "" && key === 0) || category === d?'600':'400',borderRadius:'10px',padding:'0.5em 1em',cursor:'pointer'}} onClick={()=>{inface.setCategory(d);setCategory(d)}}>{d}</div>
            )}
        </div>
        <div style={{display:'grid',gridTemplateRows:'2em 1fr'}}>
            <div style={{fontWeight:'bold',fontSize:'1.3em'}}>{category === ""?categories[0]:category}</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gridGap:'2em',padding:'1em',}}>
                {inface.blocks.filter(d=>d.type === 'Товар' && (!category.length || JSON.parse(d.obj || "{}").category === inface.category)).slice().sort((a,b)=>a.priority-b.priority).map((d,key)=><Distrib data={d} key={category+d.id+JSON.parse(d.obj || '{}').background}/>)}
            </div>
        </div>
    </div>)
});
export default Block;