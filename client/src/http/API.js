import {$authHost, $host} from './index';
import jwt_decode from 'jwt-decode';


export const updatePost = async (id,text,media,page,limit) => {
    let formData = new FormData();
    formData.append('id',id);
    formData.append('text',text);
    formData.append('media',media);
    formData.append('page',page);
    formData.append('limit',limit);
    const {data} = await $authHost.put('api/posts/', formData)
    return data
}
export const createPost = async (text,media,page,limit) => {
    let formData = new FormData()
    formData.append('text',text);
    formData.append('file',media);
    formData.append('page',page);
    formData.append('limit',limit);
    const {data} = await $authHost.post('api/posts',formData)
    return data
}
export const deletePost = async (id,page,limit) => {
    let formData = new FormData()
    formData.append('page',page);
    formData.append('limit',limit);
    const {data} = await $authHost.post('api/posts/delete/' + id,formData)
    return data
}
export const getPosts = async (page,limit) => {
    let formData = new FormData()
    formData.append('page',page);
    formData.append('limit',limit);
    const {data} = await $host.post('api/posts/get',formData)
    return data
}
export const sendMail = async (email) => {
    const {data} = await $host.post('api/user/sendMail',{email})
    return data
}
export const checkCode = async (email, code) => {
    const {data} = await $host.post('api/user/checkCode',{email, code})
    if(data.token){
        window.localStorage.setItem('token', data.token)
        return jwt_decode(data.token)
    }else{
        return data
    }
}
export const setUsername = async (username) => {
    const {data} = await $authHost.put('api/user/setName',{username})
    window.localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}
export const getUsers = async () => {
    const {data} = await $authHost.get('api/user/getUsers')
    return data
}
export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    window.localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}