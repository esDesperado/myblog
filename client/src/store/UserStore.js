import {makeAutoObservable} from "mobx";
export default class UserStore{
    constructor(){
        this._isAuth = false
        this._user = {}
        this._users = []
        makeAutoObservable(this)
    }
    setUsers(val){
        this._users = val
    }
    get users(){
        return this._users
    }
    setUser(val){
        this._user = val
    }
    get user(){
        return this._user
    }
    setIsAuth(val){
        this._isAuth = val
    }
    get isAuth(){
        return this._isAuth
    }
}