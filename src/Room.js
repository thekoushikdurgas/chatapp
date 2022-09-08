/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Loading from "./Loading";
import Cookies from 'js-cookie';
import Messagediv from './component/message';
import { useParams, Link, useNavigate } from "react-router-dom";

export default function Room({ host, socket }) {
  const { id } = useParams();
  let navigate = useNavigate();
  const [render, setrender] = useState(true);
  const [status, setstatus] = useState('');
  const [userchat, setuserchat] = useState([]);
  // const [userchatno, setuserchatno] = useState(0);
  const [members, setmembers] = useState(0);
  const [leftside, setleftside] = useState(1);
  const [memberlist, setmemberlist] = useState([]);
  // const [userchatno1, setuserchatno1] = useState(0);
  const [message, setmessage] = useState('');
  const [menu, setmenu] = useState(false);
  const [contactactivefacebook, setcontactactivefacebook] = useState('');
  const [contactactivetwitter, setcontactactivetwitter] = useState('');
  const [contactactiveinstagram, setcontactactiveinstagram] = useState('');
  const [userimg, setuserimg] = useState('');
  const [username, setusername] = useState('');
  // const [userusername, setuserusername] = useState('');
  // const [useremail, setuseremail] = useState('');
  const [users, setusers] = useState([]);
  const [user, setuser] = useState([]);
  const getusers = async () => {
    // if (Cookies.get('userauthtoken') !== undefined) {
    const response = await fetch(`${host}/api/auth/getroomusers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "userauthtoken": Cookies.get('userauthtoken'),
        "roomauthtoken": id
      }
    });
    const json = await response.json();
    setusers(json);
    // }
  }
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
    const response = await fetch(`${host}/api/sentroommessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "userauthtoken": Cookies.get('userauthtoken'),
        "roomauthtoken": id,
        "message": message
      }
    });
    const json = await response.json();
    if (json['success']) {
      socket.emit("send_message", {
        message: json.message, room: id, contact: json.contact,
        headers: {
          'Content-Type': 'application/json',
          "userauthtoken": Cookies.get('userauthtoken'),
          "roomauthtoken": id,
          "message": message
        }
      });
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
    let response = await fetch(`${host}/api/roomsdetails`, { method: 'POST', headers: { 'Content-Type': 'application/json', "roomauthtoken": id, "userauthtoken": Cookies.get('userauthtoken'), } });
    let json = await response.json();
    // console.log(json);
    if (json.success) {
      setuserimg(json.room.roomimg);
      setusername(json.room.roomname);
      setmemberlist(json.room.roommembers);
      setmembers(json.room.roommembers.length);
      // setuseremail(json.room.email);
      setstatus(json.room.status);
      setcontactactivefacebook('/');
      setcontactactivetwitter('/');
      setcontactactiveinstagram('/');
      setuserchat(json.room.messagelist);
      localStorage.setItem("messagelist", []);
      localStorage.setItem("messagelist", JSON.stringify(json.room.messagelist));
      setTimeout(() => {
        const messageselem = document.getElementById('messages');
        messageselem.scrollTop = messageselem.scrollHeight + messageselem.scrollHeight;
      }, 1000);
    }
  }
  const searchjson = (b) => {
    if (b === "") {
      return [];
    } else {
      return users.filter(function (x) { if (x['name'].toLowerCase().indexOf(b.toLowerCase()) > -1) { return x; } })
    }
  }
  const getcontactlist = async () => {
    const response = await fetch(`${host}/api/roommember`, {
      method: 'GET', headers: { 'Content-Type': 'application/json', "userauthtoken": Cookies.get('userauthtoken'), "roomauthtoken": id, }
    });
    const json = await response.json();
    setmemberlist(json);
    // setcontactsno(json.length);
  }
  const addcontacts = async (authtoken) => {
    // if (Cookies.get('userauthtoken') !== undefined) {
    var response = await fetch(`${host}/api/addroommember`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "userauthtoken": Cookies.get('userauthtoken'),
        "roomauthtoken": id,
        "contacttoken": authtoken,
      }
    });
    var json = await response.json();
    if (json['success']) {
      // console.log(json)
      getcontactlist();
      setleftside(0);
      setuser([]);
      searchjson('');
      response = await fetch(`${host}/api/tkdchat`, { method: 'POST', headers: { 'Content-Type': 'application/json', "userauthtoken": Cookies.get('userauthtoken'), "contacttoken": authtoken, "message": 'hi' } });
      json = await response.json();
      if (json['success']) {
        socket.emit("send_message", { message: json.message, room: id, contact: json['contactemail'] });
      } else {
        console.log(json);
      }
    }
  }
  const joinmessage = async (message) => {
    setuserchat([...JSON.parse(localStorage.getItem("messagelist")), message]);
    localStorage.setItem("messagelist", JSON.stringify([...JSON.parse(localStorage.getItem("messagelist")), message]));
  }
  useEffect(() => {
    if (users.length === 0) { getusers(); }
    if (render) {
      const fetchData = async () => {
        // if (Cookies.get('userauthtoken') !== undefined) {
        socket.emit("join_room", id);
        userdeatails();
        setrender(false);
        // }
      }
      fetchData();
    }
    socket.on("receive_message", async (data) => {
      // console.log(data);
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
      {users.length !== 0 ? (
        <div className="overflow-hidden w-full flex items-center justify-center">
          <div className={`h-auto md:rounded-[1vw] rounded-[0] bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border border-[#ffffff80] backdrop-blur-[5px]`}>
            <div className="p-[9px]">
              <div className="flex items-center justify-between">
                <div className='flex items-center gap-2'>
                  <div className={`w-[40px] h-[40px] rounded-full cursor-pointer border ${status === 'online' ? 'border-[#2ecc71]' : ''} ${status === 'away' ? 'border-[#f1c40f]' : ''} ${status === 'busy' ? 'border-[#e74c3c]' : ''} ${status === 'offline' ? 'border-[#95a5a6]' : ''}`}><div className='w-full h-full overflow-hidden rounded-full'><img src={userimg} className={`w-full h-full scale-110`} alt={username} /></div></div>
                  <div className='flex flex-col'>
                    <p className='font-semibold'>{username}</p>
                    <p className='text-[11px] opacity-50'>{members}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2 text-[19px] leading-[0]'>
                  <i className="tkd10-peoples-group cursor-pointer" onClick={() => { setleftside(0) }}  ></i>
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
            <div id='messages' className={`${leftside === 1 ? 'block' : 'hidden'} messages border-t border-b border-[#ffffff80] p-[10px] h-[70vh] overflow-y-scroll overflow-x-hidden`} style={{ background: `url("//koushikchandrasaha.thekoushikdurgas.in/svg/tkd/Chatbg.svg")` }}>
              <ul>
                {userchat.map((t, i) => {
                  return (
                    <Messagediv t={t} useremail={Cookies.get('useremail')} key={i} />
                  );
                })}
              </ul>
            </div>
            <div className={`gap-3 h-[45px] p-[6px_10px] ${leftside === 1 ? 'flex' : 'hidden'}`}>
              <i className="tkd8-cool-emoji m-auto text-[20px]"></i>
              <i className="tkd7-clip-line m-auto text-[20px]"></i>
              <input type="text" placeholder="Write your message..." value={message} className="md:rounded-[1vw] rounded-[10px] h-full px-[9px] w-full bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border border-[#ffffff80] backdrop-blur-[5px]" onChange={(event) => { setmessage(event.target.value) }} />
              <i className="tkd3-nc-sample-glyph_media-mic m-auto text-[20px]"></i>
              <i className="tkd8-direction-arrow-right m-auto text-[20px]" onClick={newMessage}></i>
            </div>
            <div className={`bottom-bar w-full border-t border-[#ffffff80] ${leftside === 0 ? 'flex' : 'hidden'}`}>
              {/* <div className='text-[20px] flex items-center border-t border-[#ffffff80]'><i className="tkd2-arrow-narrow-left w-[44px] h-[44px] flex items-center justify-center" onClick={() => { setleftside(0); }}></i><i className='tkd4-iconmonstr-user-10 w-[44px] h-[44px] flex items-center justify-center'></i><span>Add contact</span></div> */}
              <button className="addcontact w-1/2 border-[0] flex items-center gap-2 text-[20px]" onClick={() => { setleftside(1) }}><i className="tkd2-arrow-narrow-left w-[44px] h-[44px] flex items-center justify-center" onClick={() => { setleftside(0); }}></i><i className='tkd1-Home cursor-pointer w-[44px] h-[44px] flex items-center justify-center'></i><span>Room</span></button>
              <button className="addcontact w-1/2 border-[0] hover:text-tkd2 flex items-center gap-2 justify-center border-l border-[#ffffff80]" onClick={() => { }}><i className="tkd4-iconmonstr-user-25 text-[19px]"></i> <span>Add Room</span></button>
            </div>
            <div className={`w-full h-[80vh] ${leftside === 0 ? 'flex' : 'hidden'}`}>
              <div className='w-1/2'>
                <div className={`border-t border-b border-[#ffffff80] flex`}>
                  <label htmlFor="search" className='w-[44px] items-center justify-center bg-[#ffffff1a]  hidden md:flex'><i className="tkd2-search2"></i></label>
                  <input type="text" placeholder="Search members..." name='search' className='p-[10px] md:p-[10px_0] w-full border-[none] bg-[#ffffff1a] focus:outline-[none] placeholder:text-textcolor' />
                </div>
                <div className='p-[10px] pb-[35px] h-full overflow-y-scroll overflow-x-hidden' style={{ background: `url("//koushikchandrasaha.thekoushikdurgas.in/svg/tkd/Chatbg.svg")` }}>
                  <ul className='flex flex-wrap'>
                    {memberlist.map((t, i) => {
                      return (
                        <li className={`w-full m-[10px] md:rounded-[1vw] rounded-[10px] relative p-[10px] text-[0.9em] cursor-pointer bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border-[2px] backdrop-blur-[5px] ${t.status === 'online' ? 'border-[#2ecc71]' : ''} ${t.status === 'away' ? 'border-[#f1c40f]' : ''} ${t.status === 'busy' ? 'border-[#e74c3c]' : ''} ${t.status === 'offline' ? 'border-[#95a5a6]' : ''}`} key={i} onClick={() => { navigate(`/chat/${t.authtoken}`, { replace: true }) }}>
                          <div className="flex gap-2 items-center">
                            <div className="w-[40px] h-[40px] rounded-full cursor-pointer"><div className='w-[40px] overflow-hidden rounded-full'><img src={t.picimg} alt={t.name} className="w-[37px] h-[37px] scale-110" /></div></div>
                            <div className='flex flex-col'>
                              <p className='font-semibold'>{t.name}</p>
                              <p className='text-[11px] opacity-50'>{t.last}</p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className='w-1/2 border-l border-[#ffffff80]'>
                <div className={`border-t border-b border-[#ffffff80] flex`}>
                  <label htmlFor="search" className='w-[44px] items-center justify-center bg-[#ffffff1a]  hidden md:flex'><i className="tkd2-search2"></i></label>
                  <input type="text" placeholder="Search contacts..." name='search' className='p-[10px] md:p-[10px_0] w-full border-[none] bg-[#ffffff1a] focus:outline-[none] placeholder:text-textcolor' onChange={(event) => { setuser(searchjson(event.target.value)) }} />
                </div>
                <div className='p-[10px] h-full overflow-x-scroll overflow-y-hidden' style={{ background: `url("//koushikchandrasaha.thekoushikdurgas.in/svg/tkd/Chatbg.svg")` }}>
                  <ul className='flex flex-wrap'>
                    {user.map((t, i) => {
                      return (
                        <li className={`w-full m-[10px] md:rounded-[1vw] rounded-[10px] relative p-[10px] text-[0.9em] cursor-pointer  bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border border-[#ffffff80] backdrop-blur-[5px]`} key={i}>
                          <div className="flex gap-2 items-center justify-between">
                            <div className="flex gap-2 items-center">
                              <div className="w-[40px] h-[40px] rounded-full cursor-pointer"><div className='w-[40px] overflow-hidden rounded-full'><img src={t.picimg} alt={t.name} className="w-[37px] h-[37px] scale-110" /></div></div>
                              <div className='flex flex-col'>
                                <p className='font-semibold'>{t.name}</p>
                                <p className='text-[11px] opacity-50'>{t.username}</p>
                              </div>
                            </div>
                            <div><i className={`tkd7-add-${t.gender.toLowerCase()}-user text-[23px]`} onClick={() => { addcontacts(t.authtoken) }}></i></div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (<Loading />)}
    </>
  )
}