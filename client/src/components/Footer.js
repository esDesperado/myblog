import React from "react";
import {observer} from "mobx-react-lite";
const block =  observer(() => {
    return(
        <div style={{padding:'90px 0',color:'white',placeItems:'center',display:'grid',gridTemplateColumns:'1fr',background:"#525252",width:'100%',height:'80px'}}>
            <span style={{fontSize:'1.3em'}}>MYBLOG.NET</span>
            <span>2023</span>
        </div>
    )
})
export default block;