import React, {useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {createPost, updatePost, deletePost, getPosts} from "../../http/API"
import LazyImage from "../../components/LazyImage";
import Header from "../../components/Header"
import Footer from "../../components/Footer"
const MainPage = observer(() => {
    const {inface,user} = useContext(Context)
    const [text,setText] = useState("")
    const [media,setMedia] = useState(null)
    const [id,setId] = useState(0)
    return(
        <div style={{width:'100%',fontSize:inface.width > 350?inface.width > 600?'16px':'12px':'11px',position:'relative',}}>
            <Header/>
            {id?<h1>Редактировать запись</h1>:<h1>Мой блог</h1>}
            {user.isAuth &&
                <div style={{display:'grid',placeItems:'center',gridTemplateColumns:'1fr',gridGap:'2em',paddingBottom:'100px'}}>
                    <b style={{fontSize:'1.1em',gridColumn:'1/2'}}>Расскажите что нибудь</b>
                    <textarea onChange={e=>setText(e.target.value)} style={{width:"80%"}} rows="12" value={text}></textarea>
                    Выберите изображение:
                    {updatePost && typeof(media) === "string" && media.length > 0?
                        <span>{media}<svg onClick={()=>{setMedia(null)}} style={{cursor:'pointer',width:'20px',height:'20px',marginLeft:'15px',fill:'red',}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg></span>
                    :
                        <input onChange={e=>setMedia(e.target.files[0])} type="file" />
                    }
                    <button onClick={()=>{
                        if(!id){
                            createPost(text,media,inface.page,inface.limit).then(data=>{
                                inface.setPosts(data.data);
                                inface.setCount(data.count);
                            })
                        }else {
                            updatePost(id,text,media,inface.page,inface.limit).then(data=>{
                                inface.setPosts(data.data);
                                inface.setCount(data.count);
                            })
                        }
                        setId(0);
                        setText("");
                        setMedia(null);
                    }} style={{fontSize:"1.2em",padding:'20px 60px',background:text.length > 1?"#1576FF":"#525252",borderRadius:"5px",border:'none',color:'white',cursor:'pointer'}}>{id?"Сохранить":"Опубликовать"}</button>
                </div>
            }
            <div>
                {inface.posts.slice().sort((a,b)=>b.id - a.id).map(data=>
                    <div key={data.id + data.media + data.text} style={{display:'grid',placeItems:'center',padding:'10%',position:'relative'}}>
                        {data.author === user.user.id &&<svg onClick={()=>{
                            window.scrollTo(0, 0);
                            setId(data.id);
                            setMedia(data.media);
                            setText(data.text);
                        }} style={{cursor:'pointer',width:'20px',height:'20px',fill:'black',float:'right',position:'absolute',right:'150px',top:'70px'}} viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#writeSVG' ></use></svg>}
                        {data.author === user.user.id &&<svg onClick={()=>{
                            if(window.confirm("Вы уверены что хотите удалить запись?")){
                                deletePost(data.id,inface.page,inface.limit).then(data=>{
                                    inface.setPosts(data.data);
                                    inface.setCount(data.count);
                                })
                            }
                        }} style={{cursor:'pointer',width:'20px',height:'20px',fill:'black',float:'right',position:'absolute',right:'100px',top:'70px'}} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#crossSVG' ></use></svg>}
                        {data.text}
                        <LazyImage style={{maxHeight:'500px',margin:'50px 0'}} src={data.media.length && process.env.REACT_APP_API_URL + data.media} />
                        <span style={{opacity:'0.7'}}>Дата публикации: {data.date}</span>
                        <span style={{opacity:'0.7'}}>Автор: {user.users.filter(u=>u.id === data.author)[0] && user.users.filter(u=>u.id === data.author)[0].username}</span>
                    </div>
                )}
            </div>
            <div style={{display:'grid',placeItems:'center',paddingBottom:'100px',textAlign:'center'}}>
                {Math.ceil(inface.count / inface.limit) > 1 &&<h4>Страницы</h4>}
                <div style={{display:'grid',gridAutoFlow:'column',gridGap:'1em',maxWidth:Math.ceil(inface.count / inface.limit) * 50 + 'px'}}>
                    {Array.from({length:Math.ceil(inface.count / inface.limit)},(_,i)=>i + 1).map(i=>
                        <button key={i+'p'} style={{color:inface.page === i?'#1576FF':'inherit',textDecoration:inface.page === i?'underline':'inherit',fontWeight:inface.page === i?'bold':'inherit',cursor:'pointer',fontSize:'1.2em'}} onClick={()=>{
                            inface.setPage(i);
                            getPosts(i,inface.limit).then(data=>{
                                inface.setPosts(data.data);
                                inface.setCount(data.count);
                            });
                            window.scrollTo(0, 0);
                        }}>{i}</button>
                    )}

                </div>
            </div>
            <Footer/>
        </div>
    );
});
export default MainPage;