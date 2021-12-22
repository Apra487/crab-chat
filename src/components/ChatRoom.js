import React, { useRef, useEffect } from 'react';

import Send from '../assets/icons8-send-64.png'

import '../styles/ChatRoom.css';

import ChatMessage from './ChatMessage.js';




export default function ChatRoom( { handleSubmit, text, setText, msgs: messages }) {
    const dummy = useRef();

    useEffect(() => {
      if(dummy.current) dummy.current.scrollIntoView({ behavior: 'smooth' })
    },[])

  
    return (<>
      <div className='main'>
  
        {messages.length ? messages.map((msg, i)=> <ChatMessage key={i} message={msg} />) : (<></>)}
  
        <span ref={dummy}></span>
  
      </div>
  
      <form onSubmit={handleSubmit}>
  
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="say something nice" />
  
        <button type="submit" disabled={!text}><img src={Send} alt="send" /></button>
  
      </form>
    </>)
  }