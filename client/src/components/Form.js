import React, {useContext,useState} from 'react';
import {Context} from '../index';
import {observer} from "mobx-react-lite";
import {callMe} from "../http/API"

const Block = observer((data,v) => {
    const {inface} = useContext(Context)
    data = data.data
    const [formObj,setFormObj] = useState({})
    const [formSent,setFormSent] = useState(localStorage.getItem('callCond')?true:false)
    function callMeClick(){
        let formCond = true
        if(JSON.parse(data.obj || '{}').inputs.length){
            JSON.parse(data.obj || '{}').inputs.map(d=>{
                if(!(formObj[d] && formObj[d].length > 1)){formCond = false}
                return true
            })
        }
        if(formCond){
            const formData = new FormData()
            formData.append('code','!s_pd%ad1fdsemffgqd!^$^@%&^fa*&Y_s--dsf--j9UJ_p-ga=aw--=+an_se-dq=ra$$b$')
            formData.append('obj',JSON.stringify(formObj))
            console.log(formObj)
            setFormSent(true)
            callMe(formData)
            localStorage.setItem('callCond',new Date().toISOString().split('T')[0]);
        }
    }
    return(<div style={{zIndex:'1'}}>
        {!formSent && <div style={{fontSize:'1.2em',lineHeight:'2em'}} dangerouslySetInnerHTML={{__html:JSON.parse(data.obj || '{}').topText}}/>}
        {!formSent && <div style={{display:'grid',gridGap:'3em',margin:'40px 0',gridAutoFlow:JSON.parse(data.obj || '{}').inputOrientation === 'горизонтально' && !inface.mobile?'column':'row',justifyItems:'center'}}>
            {JSON.parse(data.obj || '{}').inputs.length && JSON.parse(data.obj || '{}').inputs.map(d=>
                <div>
                    <b style={{fontSize:'0.9em',}}>{d+':'}</b><br/>
                    <input onBlur={e=>{if(e.target.value.trim().length > 1){let obj2 = JSON.parse(JSON.stringify(formObj));obj2[d] = e.target.value;setFormObj(obj2)}}} style={{background:JSON.parse(data.obj || "{}").inputsBackground || inface.interface.background,marginTop:'8px',border:'1px #D1D1D2 solid',padding:'10px 15px',borderRadius:'4px',width:inface.width > 300?'250px':'calc(100% - 30px)'}} type='text'/>
                </div>)}
            <div><br/><input onClick={()=>{callMeClick();}} value={JSON.parse(data.obj || '{}').btnText} style={{fontSize:'1em',marginTop:'8px',cursor:'pointer',fontWeight:'bold',background:'transparent',color:JSON.parse(data.obj || '{}').btnColor || '#ffffff',border:'1px '+(JSON.parse(data.obj || '{}').btnColor || '#ffffff')+' solid',padding:'8px 15px',borderRadius:'4px',width:'200px'}} type='button'/></div>
        </div>}
        {!formSent && <div dangerouslySetInnerHTML={{__html:JSON.parse(data.obj || '{}').bottomText}}/>}
        {formSent && <div style={{fontSize:'1.2em',lineHeight:'2em'}} dangerouslySetInnerHTML={{__html:JSON.parse(data.obj || '{}').textAfterSend}}/>}
    </div>)
});
export default Block;