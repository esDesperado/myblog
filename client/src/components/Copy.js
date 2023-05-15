import React, {useContext,useState,useEffect,useRef,createRef} from 'react';
import {Context} from '../index';
import {NavLink,useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {setBAttr,deleteBlock,deleteComponent,addComponent,setCAttr,auth} from "../http/API"
import {Editor} from '@tinymce/tinymce-react';
import {ADMIN_ROUTE} from "../utils/consts";
import Distrib from "./Distrib"

const Block = observer((data) => {
    const {user,product,inface} = useContext(Context)
    data = data.data
    let element = inface.blocks.filter(d=>d.id === parseInt(JSON.parse(data.obj || '{}').elementId))[0]
    return(<Distrib data={element}/>)
});
export default Block;