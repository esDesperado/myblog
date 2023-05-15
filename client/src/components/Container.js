import React, {useContext} from 'react';
import {Context} from '../index';
import {observer} from "mobx-react-lite";
import Distrib from "./Distrib"
const Block = observer((data,v) => {
    const {inface} = useContext(Context)
    data = data.data
    let arr1 = inface.blocks.filter(d=>d.parent === 'block'+data.id).slice().sort((a,b)=>a.priority-b.priority)
    return(arr1.map((d,key)=><Distrib data={d}/>))
});
export default Block;