import {makeAutoObservable} from "mobx";

export default class InterfaceStore{
    constructor(){
        this._posts = []
        this._count = 0
        this._page = 1
        this._limit = 20
        this._mobile = false
        this._width = window.innerWidth
        this._height = document.documentElement.clientHeight
        makeAutoObservable(this)
    }
    setCount(data){
        this._count = data
    }
    get count(){
        return this._count
    }
    setMobile(data){
        this._mobile = data
    }
    get mobile(){
        return this._mobile
    }
    setPosts(data){
        this._posts = data
    }
    get posts(){
        return this._posts
    }
    setWidth(data){
        this._width = data
    }
    get width(){
        return this._width
    }
    setHeight(data){
        this._height = data
    }
    get height(){
        return this._height
    }
    setLimit(data){
        this._limit = data
    }
    get limit(){
        return this._limit
    }
    setPage(data){
        this._page = data
    }
    get page(){
        return this._page
    }
}