import {$authHost, $host} from './index';
import jwt_decode from 'jwt-decode';


export const sendQuiz = async (form) => {
    const {data} = await $authHost.post('api/mail/quiz', form)
    return data
}
export const mail = async (proc,form) => {
    const {data} = await $authHost.post('api/mail/mail/' + proc, form)
    return data
}
export const changeSite = async (proc,form) => {
    const {data} = await $authHost.post('api/site/' + proc, form)
    return data
}
export const setObjProperty = async (name,attr,id) => {
    let formData = new FormData();
    formData.append('name',name);
    formData.append('attr',attr);
    const {data} = await $authHost.put('api/blocks/obj/'+id, formData)
    return data
}
export const setBAttr = async (name,attr,id) => {
    let formData = new FormData();
    formData.append('name',name);
    formData.append('attr',attr);
    const {data} = await $authHost.put('api/blocks/'+id, formData)
    return data
}
export const addBlock = async (type,priority,parent,obj) => {
    let formData = new FormData()
    formData.append('type',type);
    formData.append('priority',priority);
    formData.append('parent',parent);
    formData.append('obj',obj);
    const {data} = await $authHost.post('api/blocks',formData)
    return data
}
export const deleteBlock = async (id) => {
    const {data} = await $authHost.delete('api/blocks/' + id)
    return data
}
export const fetchBlocks = async () => {
    const {data} = await $host.get('api/blocks')
    return data
}
export const addComponent = async (type,priority) => {
    let formData = new FormData()
    formData.append('type',type);
    formData.append('priority',priority);
    const {data} = await $authHost.post('api/component', formData)
    return data
}
export const fetchComponents = async () => {
    const {data} = await $host.get('api/component')
    return data
}
export const deleteComponent = async (id) => {
    const {data} = await $authHost.delete('api/component/' + id)
    return data
}
export const setCAttr = async (name,attr,type,id) => {
    let formData = new FormData();
    formData.append('name',name);
    formData.append('attr',attr);
    formData.append('type',type);
    const {data} = await $authHost.put('api/component/'+id, formData)
    return data
}

export const setIAttr = async (name,attr) => {
    let formData = new FormData();
    formData.append('name',name);
    formData.append('attr',attr);
    const {data} = await $authHost.post('api/interface', formData)
    return data
}
export const updateInterface = async (inface) => {
    const {data} = await $authHost.put('api/interface', inface)
    return data
}
export const getInterface = async () => {
    const {data} = await $host.get('api/interface')
    return data
}
export const fetchOneComponent = async (id) => {
    const {data} = await $authHost.get('api/component/one/' + id)
    return data
}
export const auth = async (login, password, cond) => {
    const sc = '5_Ax1v_3lF51Sd_7cp8_i2s3Ml9!%@^____-PwE_0L_q_qQ'
    const {data} = await $host.post('api/user/login',{login, password,cond,sc})
    if(data.token){
        window.localStorage.setItem('token', data.token)
        return jwt_decode(data.token)
    }else{
        return data
    }
}
export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    if(data !== 'NO TOKEN'){
        window.localStorage.setItem('token', data.token)
        return jwt_decode(data.token)
    }else{
        window.localStorage.removeItem('token')
        return data
    }
}
export const callMe = async (form) => {
    const {data} = await $host.post('api/mail/callMe',form)
    return data
}