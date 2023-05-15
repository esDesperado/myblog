import React, {useContext} from 'react';
import {Context} from '../index';
import {observer} from "mobx-react-lite";
import Distrib from "./Distrib"
const Block = observer((data) => {
    const {inface} = useContext(Context)
    data = data.data
    let element = inface.blocks.filter(d=>d.id === parseInt(JSON.parse(data.obj || '{}').elementId))[0]
    return(<Distrib data={element}/>)
});
export default Block;