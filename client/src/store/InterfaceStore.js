import {makeAutoObservable} from "mobx";

export default class InterfaceStore{
    constructor(){
        this._interface = {}
        this._typesList = ['Контейнер','HTML блок','Картинка','Текст','Слайдер','Копия','Форма','Список товаров','Товар','Квиз','Видео','Калькулятор']
        this._objList = {
            'Контейнер':JSON.stringify({css:`min-height:200px;
display:grid;
position:relative;
min-width:200px;
max-height:none;
background:transparent;
padding:30px 5% 30px 5%;
`,
                pcShow:true,
                mobileShow:true,
                fRight:'inherit',
                fTop:'inherit',
                fWidth:'100%',
                fRightM:'inherit',
                fTopM:'inherit',
                fWidthM:'100%',
            }),
            'HTML блок':JSON.stringify({css:`min-height:200px;
display:grid;
position:relative;
min-width:200px;
max-height:none;
background:transparent;
padding:30px 5% 30px 5%;
`,
                pcShow:true,
                mobileShow:true,
                fRight:'inherit',
                fTop:'inherit',
                fWidth:'100%',
                fRightM:'inherit',
                fTopM:'inherit',
                fWidthM:'100%',
            }),
            'Картинка':JSON.stringify({css:`min-height:200px;
display:grid;
position:relative;
min-width:200px;
max-width:400px;
max-height:none;
background:transparent;
padding:10px 10px 10px 10px;
`,
                pcShow:true,
                mobileShow:true,
                fRight:'inherit',
                fTop:'inherit',
                fWidth:'100%',
                fRightM:'inherit',
                fTopM:'inherit',
                fWidthM:'100%',
            }),
            'Текст':JSON.stringify({css:`min-height:0px;
display:grid;
position:relative;
min-width:200px;
min-height:1em;
max-height:none;
background:transparent;
padding:0 0 0 0;
`,
                pcShow:true,
                mobileShow:true,
                fRight:'inherit',
                fTop:'inherit',
                fWidth:'100%',
                fRightM:'inherit',
                fTopM:'inherit',
                fWidthM:'100%',
            }),
            'Слайдер':JSON.stringify({css:`position:relative;
padding:0 0 0 0;
`,
                pcShow:true,
                mobileShow:true,
                fRight:'inherit',
                fTop:'inherit',
                fWidth:'100%',
                fRightM:'inherit',
                fTopM:'inherit',
                fWidthM:'100%',
            }),
            'Форма':JSON.stringify({css:`min-height:200px;
display:grid;
position:relative;
min-width:200px;
max-height:none;
background:transparent;
padding:150px 0 150px 0;
grid-auto-flow:column;
justify-items:center;
align-items:center;
`,
                pcShow:true,
                mobileShow:true,
                fRight:'inherit',
                fTop:'inherit',
                fWidth:'100%',
                fRightM:'inherit',
                fTopM:'inherit',
                fWidthM:'100%',
                inputs:['Имя','Номер телефона'],
                inputOrientation:'горизонтально',
                btnText:'Отправить',
                topText:'<div style=\"text-align: center;\"><h1><strong>Остались вопросы?</strong></h1></div>\r\n<div>\r\n<div style=\"text-align: center;\">Заполните форму и мы свяжемся с Вами в ближайшее время, и постараемся Вам помочь.</div>\r\n</div>',
                bottomText:'<p style=\"text-align: center;\">Нажимая на кнопку вы даёте согласие на обработку персональных данных</p>',
                textAfterSend:'<div style=\"text-align: center;\"><h1><strong>Мы получили вашу заявку!</strong></h1></div>\r\n<div>\r\n<div style=\"text-align: center;\">Наши менеджеры свяжутся с вами в ближайшее время!</div>\r\n</div>',
            }),
            'Список товаров':JSON.stringify({css:`min-height:200px;
display:grid;
position:relative;
min-width:200px;
max-height:none;
background:transparent;
padding:30px 5% 30px 5%;
`,
                pcShow:true,
                mobileShow:true,
                fRight:'inherit',
                fTop:'inherit',
                fWidth:'100%',
                fRightM:'inherit',
                fTopM:'inherit',
                fWidthM:'100%',
                inputs:['Имя','Номер телефона'],
                inputOrientation:'горизонтально',
                btnText:'Отправить',
                topText:'<div style=\"text-align: center;\"><h1><strong>Остались вопросы?</strong></h1></div>\r\n<div>\r\n<div style=\"text-align: center;\">Заполните форму и мы свяжемся с Вами в ближайшее время, и постараемся Вам помочь.</div>\r\n</div>',
                bottomText:'<p style=\"text-align: center;\">Нажимая на кнопку вы даёте согласие на обработку персональных данных</p>',
                textAfterSend:'<div style=\"text-align: center;\"><h1><strong>Мы получили вашу заявку!</strong></h1></div>\r\n<div>\r\n<div style=\"text-align: center;\">Наши менеджеры свяжутся с вами в ближайшее время!</div>\r\n</div>',
            }),
            'Товар':JSON.stringify({css:'min-height:200px;min-width:200px;',pcShow:true,mobileShow:true,}),
            'Копия':JSON.stringify({css:'min-height:200px;min-width:200px;',pcShow:true,mobileShow:true,}),
            'Квиз':JSON.stringify({css:'min-height:200px;min-width:200px;',pcShow:true,mobileShow:true,}),
            'Видео':JSON.stringify({css:'min-height:200px;min-width:200px;',pcShow:true,mobileShow:true,}),
            'Калькулятор':JSON.stringify({css:'min-height:200px;min-width:200px;',pcShow:true,mobileShow:true,}),
        }
        this._patterns = []
        this._hh = 0
        this._phm = 0
        this._show = false
        this._width = window.innerWidth
        this._height = document.documentElement.clientHeight
        this._aback = '#FFFFFF'
        this._category = ''
        this._acolor2 = '#09FF00'
        this._acolor = '#353535'//'#09FF00'
        this._moveblock = ''
        this._blockType = null
        this._currSettings = null
        this._currText = {}
        this._currImageProp = null
        this._images = []
        this._mobile = false
        this._pages = []
        this._blocks = []
        this._basket = JSON.parse(localStorage.getItem('basket') || '[]')
        this._components = []
        this._currImages = []
        this._currImage = null
        this._currProduct = null
        makeAutoObservable(this)

    }
    setBasket(data){
        this._basket = data
    }
    get basket(){
        return this._basket
    }
    setCurrProduct(data){
        this._currProduct = data
    }
    get currProduct(){
        return this._currProduct
    }
    setCategory(data){
        this._category = data
    }
    get category(){
        return this._category
    }
    setCurrImages(data){
        this._currImages = data
    }
    get currImages(){
        return this._currImages
    }
    setCurrImage(data){
        this._currImage = data
    }
    get currImage(){
        return this._currImage
    }
    setPatterns(data){
        this._patterns = data
    }
    get patterns(){
        return this._patterns
    }
    setCurrImageProp(data){
        this._currImageProp = data
    }
    get currImageProp(){
        return this._currImageProp
    }
    setImages(data){
        this._images = data
    }
    get images(){
        return this._images
    }
    setCurrText(data){
        this._currText = data
    }
    get currText(){
        return this._currText
    }
    setObjList(data){
        this._objList = data
    }
    get objList(){
        return this._objList
    }
    setCurrSettings(data){
        this._currSettings = data
    }
    get currSettings(){
        return this._currSettings
    }
    setMobile(data){
        this._mobile = data
    }
    get mobile(){
        return this._mobile
    }
    setBlockType(data){
        this._blockType = data
    }
    get blockType(){
        return this._blockType
    }
    setMoveblock(data){
        this._moveblock = data
    }
    get moveblock(){
        return this._moveblock
    }
    setShow(data){
        this._show = data
    }
    get show(){
        return this._show
    }
    setPages(data){
        this._pages = data
    }
    get pages(){
        return this._pages
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
    setComponents(data){
        this._components = data
    }
    get components(){
        return this._components
    }
    setAback(data){
        this._aback = data
    }
    get aback(){
        return this._aback
    }
    setAcolor(data){
        this._acolor = data
    }
    get acolor(){
        return this._acolor
    }
    setAcolor2(data){
        this._acolor2 = data
    }
    get acolor2(){
        return this._acolor2
    }
    setBlocks(data){
        this._blocks = data
    }
    get blocks(){
        return this._blocks
    }
    setVariationsList(data){
        this._variationsList = data
    }
    get variationsList(){
        return this._variationsList
    }
    get typesList(){
        return this._typesList
    }
    setPHM(data){
        this._phm = data
    }
    get phm(){
        return this._phm
    }
    setHH(data){
        this._hh = data
    }
    get hh(){
        return this._hh
    }
    setInterface(data){
        this._interface = data

    }
    get interface(){
        return this._interface
    }
}