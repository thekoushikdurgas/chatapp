/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Loading from "./Loading";
import Cookies from 'js-cookie';
import Messagediv from './component/message';
import { useParams, Link } from "react-router-dom";

export default function Main({ host, socket }) {
  const { id } = useParams();
  const [render, setrender] = useState(true);
  const [status, setstatus] = useState('');
  const [userchat, setuserchat] = useState([]);
  // const location = (useLocation().pathname).split('/');
  // const [userchatno, setuserchatno] = useState(0);
  // const [userchatno1, setuserchatno1] = useState(0);
  const [message, setmessage] = useState('');
  const [menu, setmenu] = useState(false);
  const [contactactivefacebook, setcontactactivefacebook] = useState('');
  const [contactactivetwitter, setcontactactivetwitter] = useState('');
  const [contactactiveinstagram, setcontactactiveinstagram] = useState('');
  const [userimg, setuserimg] = useState('');
  const [username, setusername] = useState('');
  const [userusername, setuserusername] = useState('');
  const [useremail, setuseremail] = useState('');
  const deleteapidefault = () => {
    Cookies.remove('userauthtoken');
    window.location.assign("http://login.thekoushikdurgas.in/");
  }
  const newMessage = async () => {
    if (message.trim() === '') {
      return false;
    }
    sendMessage(message);
  }
  const sendMessage = async (message) => {
    if (message.trim() === '') {
      return false;
    }
    // if (Cookies.get('userauthtoken') !== undefined) {
    const response = await fetch(`${host}/api/tkdchat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "userauthtoken": Cookies.get('userauthtoken'),
        "contacttoken": id,
        "message": message
      }
    });
    const json = await response.json();
    if (json['success']) {
      socket.emit("sendsinglemessage", { message: json.message, contact: useremail, user: Cookies.get('useremail') });
    }
    setmessage('');
    // }
  }
  window.onkeydown = (e) => {
    if (e.which === 13) {
      newMessage();
      return false;
    }
  }
  window.onclick = (e) => {
    if (e.target !== document.getElementsByClassName('mainmenu')[0]) { setmenu(false) }
  }
  const userdeatails = async () => {
    let response = await fetch(`${host}/api/getuser`, { method: 'POST', headers: { 'Content-Type': 'application/json', "userauthtoken": id, } });
    let json = await response.json();
    if (json.success) {
      setuserimg(json.user.picimg);
      setusername(json.user.name);
      setuserusername(json.user.username);
      setuseremail(json.user.email);
      setstatus(json.user.status);
      setcontactactivefacebook('/');
      setcontactactivetwitter('/');
      setcontactactiveinstagram('/');
    }
    response = await fetch(`${host}/api/getusermess`, { method: 'POST', headers: { 'Content-Type': 'application/json', "userauthtoken": Cookies.get('userauthtoken'), 'contacttoken': id } });
    json = await response.json();
    if (json.success) {
      setuserchat(json.messagelist);
      localStorage.setItem("messagelist", []);
      localStorage.setItem("messagelist", JSON.stringify(json.messagelist));
      setTimeout(() => {
        const messageselem = document.getElementById('messages');
        messageselem.scrollTop = messageselem.scrollHeight + messageselem.scrollHeight;
      }, 1000);
    }
  }
  const joinmessage = async (message) => {
    setuserchat([...JSON.parse(localStorage.getItem("messagelist")), message]);
    localStorage.setItem("messagelist", JSON.stringify([...JSON.parse(localStorage.getItem("messagelist")), message]));
  }
  useEffect(() => {
    if (render) {
      const fetchData = async () => {
        // if (Cookies.get('userauthtoken') !== undefined) {
        userdeatails();
        setrender(false);
        // }
      }

      fetchData();
    }
    socket.on("receivesinglemessage", async (data) => {
      // console.log(location);
      await joinmessage(data.message);
      setTimeout(() => {
        const messageselem = document.getElementById('messages');
        if (messageselem !== null) {
          messageselem.scrollTop = messageselem.scrollHeight + messageselem.scrollHeight;
        } 
      }, 1000);
    });
  }, [render, socket]);
  return (
    <>
      {!render ? (
        <div className="overflow-hidden md:w-[90%] w-full flex items-center justify-center">
          <div className={`h-auto md:rounded-[1vw] rounded-[0] bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border border-[#ffffff80] backdrop-blur-[5px]`}>
            <div className="p-[9px]">
              <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                  <div className={`w-[40px] h-[40px] rounded-full cursor-pointer border ${status === 'online' ? 'border-[#2ecc71]' : ''} ${status === 'away' ? 'border-[#f1c40f]' : ''} ${status === 'busy' ? 'border-[#e74c3c]' : ''} ${status === 'offline' ? 'border-[#95a5a6]' : ''}`}><div className='w-[40px] overflow-hidden rounded-full'><img src={userimg} className={`w-full h-full scale-110`} alt={username} /></div></div>
                  <div className='flex flex-col'>
                    <p className='font-semibold'>{username}</p>
                    <p className='text-[11px] opacity-50'>{userusername}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2 text-[19px] leading-[0]'>
                  <Link to='/'><i className="tkd1-Home cursor-pointer"></i></Link>
                  <a href={contactactivefacebook}><i className="tkd4-iconmonstr-facebook-3 cursor-pointer"></i></a>
                  <a href={contactactivetwitter}><i className="tkd4-iconmonstr-twitter-4 cursor-pointer"></i></a>
                  <a href={contactactiveinstagram}><i className="tkd4-iconmonstr-instagram-11 cursor-pointer"></i></a>
                  <i className="tkd2-menu mainmenu cursor-pointer" onClick={() => { setmenu(!menu) }}  ></i>
                </div>
                <div className={`w-[190px] leading-[1] absolute top-[31px] right-[20px] opacity-0 z-[1000] origin-[top_right] bg-white rounded-[6px] text-tkd2 shadow-[0_20px_50px_#00000026] p-[5px] before:content-[""] before:absolute before:w-[0] before:h-[0] before:border-l-[6px] before:border-l-[transparent] before:border-r-[6px] before:border-r-[transparent] before:border-b-[8px] before:border-b-white before:top-[-8px] before:right-[8px] ${menu ? 'top-[48px] right-[5px] w-[217px] scale-100 opacity-100 visible' : 'invisible scale-0'}`}>
                  <ul className='overflow-hidden rounded-[6px] grid gap-1 justify-items-stretch'>
                    <li className={`p-[4px_5px] gap-1 cursor-pointer flex items-center rounded-[6px] mb-[3px] hover:bg-tkd2 hover:text-white`} onClick={() => { setmenu(false); }}><i className='tkd6-beveled-star m-0'></i><p>Starred messages</p></li>
                    <li className={`p-[4px_5px] gap-1 cursor-pointer flex items-center rounded-[6px] mb-[3px] hover:bg-tkd2 hover:text-white`} onClick={() => { setmenu(false); }}><i className='tkd2-settings m-0'></i><p>Settings</p></li>
                    <li className={`p-[4px_5px] gap-1 cursor-pointer flex items-center rounded-[6px] mb-[3px] hover:bg-tkd2 hover:text-white`} onClick={() => { deleteapidefault(); }}><i className='tkd4-iconmonstr-log-out-9 m-0'></i><p>Log out</p></li>
                  </ul>
                </div>
              </div>
            </div>
            <div id='messages' className={`messages border-t border-b border-[#ffffff80] p-[10px] h-[70vh] overflow-y-scroll overflow-x-hidden`} style={{ background: `url("//koushikchandrasaha.thekoushikdurgas.in/svg/tkd/Chatbg.svg")` }}>
              <ul>
                {userchat.map((t, i) => {
                  return (
                    <Messagediv t={t} useremail={useremail} key={i} />
                  );
                })}
              </ul>
            </div>
            <div className={`flex gap-3 h-[45px] p-[6px_10px]`}>
              <i className="tkd8-cool-emoji m-auto text-[20px]"></i>
              <i className="tkd7-clip-line m-auto text-[20px]"></i>
              <input type="text" placeholder="Write your message..." value={message} className="md:rounded-[1vw] rounded-[10px] h-full px-[9px] w-full bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border border-[#ffffff80] backdrop-blur-[5px]" onChange={(event) => { setmessage(event.target.value) }} />
              <i className="tkd3-nc-sample-glyph_media-mic m-auto text-[20px]"></i>
              <i className="tkd8-direction-arrow-right m-auto text-[20px]" onClick={newMessage}></i>
            </div>
          </div>
        </div>
      ) : (<Loading />)}
    </>
  )
}