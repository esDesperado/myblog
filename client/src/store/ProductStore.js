import {makeAutoObservable,configure} from "mobx";
configure({
    enforceActions: "never",
})
export default class ProductStore{
    constructor(){
        this._categories = []
        makeAutoObservable(this)
    }
    setCategories(categories){
        this._categories = categories
    }
    get categories(){
        return this._categories
    }
}