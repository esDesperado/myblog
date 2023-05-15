import React, {useContext,useState,useEffect,useRef,createRef} from 'react';
import {Context} from '../index';
import {NavLink,useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {setBAttr,deleteBlock,deleteComponent,addComponent,setCAttr,auth} from "../http/API"
import {Editor} from '@tinymce/tinymce-react';
import {ADMIN_ROUTE} from "../utils/consts";
import Distrib from "./Distrib"

const Block = observer((data,v) => {
    const {user,product,inface} = useContext(Context)
    data = data.data
    let arr1 = inface.blocks.filter(d=>d.parent === 'block'+data.id).slice().sort((a,b)=>a.priority-b.priority)
    return(arr1.map((d,key)=><Distrib data={d}/>))
});
export default Block;