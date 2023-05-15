import {makeAutoObservable} from "mobx";
export default class UserStore{
    constructor(){
        this._role = 0
        makeAutoObservable(this)
    }
    setRole(bool){
        this._role = bool
    }
    get role(){
        return this._role
    }
}