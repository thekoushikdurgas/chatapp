/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import Loading from "./Loading";
import Cookies from 'js-cookie';
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard({ host, socket }) {
    let navigate = useNavigate();
    const [render, setrender] = useState(true);
    const [statusoptions, setstatusoptions] = useState(false);
    const [userimg, setuserimg] = useState('');
    const [username, setusername] = useState('');
    const [userusername, setuserusername] = useState('');
    // const [useremail, setuseremail] = useState('');
    const [status, setstatus] = useState('online');
    const [menu, setmenu] = useState(false);
    const [leftside, setleftside] = useState(0);
    const [contacts, setcontacts] = useState([]);
    const [rooms, setrooms] = useState([]);
    const [contactsno, setcontactsno] = useState(0);
    const [users, setusers] = useState([]);
    const [user, setuser] = useState([]);
    const getusers = async () => {
        // if (Cookies.get('userauthtoken') !== undefined) {
        const response = await fetch(`${host}/api/auth/getusers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "userauthtoken": Cookies.get('userauthtoken')
            }
        });
        const json = await response.json();
        setusers(json);
        // }
    }
    const addcontacts = async (authtoken) => {
        // if (Cookies.get('userauthtoken') !== undefined) {
        var response = await fetch(`${host}/api/addcontact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "userauthtoken": Cookies.get('userauthtoken'),
                "contacttoken": authtoken
            }
        });
        var json = await response.json();
        if (json['success']) {
            getcontactlist();
            setleftside(0);
            setusers([]);
            setuser([]);
            searchjson('');
            response = await fetch(`${host}/api/tkdchat`, { method: 'POST', headers: { 'Content-Type': 'application/json', "userauthtoken": Cookies.get('userauthtoken'), "contacttoken": authtoken, "message": 'hi' } });
            json = await response.json();
            if (json['success']) {
                socket.emit("sendsinglemessage", { message: json.message, contact: json['contactemail'], user: Cookies.get('useremail') });
            }
        }
        // }
    }
    const deleteapidefault = () => {
        Cookies.remove('userauthtoken');
        window.location.assign("http://login.thekoushikdurgas.in/");
    }
    const getcontactlist = async () => {
        const response = await fetch(`${host}/api/contact`, {
            method: 'GET', headers: { 'Content-Type': 'application/json', "userauthtoken": Cookies.get('userauthtoken') }
        });
        const json = await response.json();
        setcontacts(json);
        setcontactsno(json.length);
    }
    const getroomlist = async () => {
        const response = await fetch(`${host}/api/getrooms`, {
            method: 'post', headers: { 'Content-Type': 'application/json', "userauthtoken": Cookies.get('userauthtoken') }
        });
        const json = await response.json();
        setrooms(json);
    }
    window.onclick = (e) => {
        if (e.target !== document.getElementsByClassName('mainmenu')[0]) { setstatusoptions(false) }
        if (e.target !== document.getElementsByClassName('mainmenu')[1]) { setmenu(false) }
    }
    const searchjson = (b) => {
        if (b === "") {
            return [];
        } else {
            return users.filter(function (x) { if (x['name'].toLowerCase().indexOf(b.toLowerCase()) > -1) { return x; } })
        }
    }
    const userdeatails = async () => {
        const response = await fetch(`${host}/api/getuser`, { method: 'POST', headers: { 'Content-Type': 'application/json', "userauthtoken": Cookies.get('userauthtoken'), } });
        const json = await response.json();
        if (json.success) {
            setuserimg(json.user.picimg);
            setusername(json.user.name);
            setuserusername(json.user.username);
        }
    }
    const usersetstatus = (n) => {
        socket.emit("clientusersinglestatus", { status: n, user: Cookies.get('useremail') });
        setstatus(n);
        setstatusoptions(!statusoptions);
    }
    useEffect(() => {
        // Cookies.set('userauthtoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDk0YTYxNzQ4M2JjMTcwMDAxN2I0ZCIsImlhdCI6MTY2MTcxODMxNH0.zkwHndNlGapsTdVnWkkV_MYzWRSnHDluVWSwM7SJWLg'); Cookies.set('useremail', 'tushar@gmail.com');
        // Cookies.set('userauthtoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDk0YTZjYzUyZDE5ODE3ZGVkMDQzMiIsImlhdCI6MTY2MTcxODMxNH0.VKPkTif2yWQ1nMyVsI5yfiF4OYJb3SI1qNkGt-tS9g0'); Cookies.set('useremail', 'barnali@gmail.com');
        // Cookies.set('userauthtoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDk0YTA3ZTIwNGZmYTk4NzllY2ZhMyIsImlhdCI6MTY2MTcxODMxNH0.35IHMcIDCawC2GGLgLpQLGVFpT9dwnqz5BnrFHKHwK4'); Cookies.set('useremail', 'dipak@gmail.com');
        // Cookies.set('userauthtoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDk0YTE2ZDk3YzQ4MTkwNDhlY2M3MSIsImlhdCI6MTY2MTcxODMxNH0.U2GLg80E1rjRZiRCRPgwHKey1Rb4QzGuqcm7dPUERaU'); Cookies.set('useremail', 'vivek@gmail.com');
        // Cookies.set('userauthtoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDk0YTU0ZWQ1NTE2YjkwNTIwMmI0MCIsImlhdCI6MTY2MTcxODMxNH0.-QqYIDxjS8OV-SOu-DQ-OA69BIR2dWLU2crwlgs3G6A'); Cookies.set('useremail', 'liton@gmail.com');
        // Cookies.set('userauthtoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDk0YTgzMjdhMmFkOGNlODc0MTExOSIsImlhdCI6MTY2MTcxODMxNH0.6xuLtFEPAm8s9n2br2T2xSfECT2D5GcwdJPo6KdhZ-s'); Cookies.set('useremail', 'uttam@gmail.com');
        // Cookies.set('userauthtoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDk0OWQyZmY0N2IwNzQ2YjZlYzlkOCIsImlhdCI6MTY2MTcxODMxNH0.Aw7nM6L3NVAdEFQFsJJZOIsmKFArOYISIL_IwpiWijc'); Cookies.set('useremail', 'tkekoushikdurgas@gmail.com');
        // Cookies.set('userauthtoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDk0YTMyNzFlZDUxOGQ2Njg1NmJiZCIsImlhdCI6MTY2MTcxODMxNH0.HnjAsqk--Qu3-7DlWa_2mNmnPHlsLoWAVGfJKKs4laU'); Cookies.set('useremail', 'aman@gmail.com');
        // Cookies.set('userauthtoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDk0YmU4NmZjYzhkYzJkMjJhMDVlYiIsImlhdCI6MTY2MTcxODMxNH0.kMO9vdFjHr3pNmcxSLxZsEZFTsLScyiY5KUGzsYrQoI'); Cookies.set('useremail', 'mia@gmail.com');
        // Cookies.set('userauthtoken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDk0YTI2YmMwYjUyOTgwNmQwOWY4ZiIsImlhdCI6MTY2MTcxODI0Mn0.bQ0ncIYdqqZOOa820phNQZhIOTY_JiPEwch9yjX9dnE'); Cookies.set('useremail', 'durgas@gmail.com');
        if (render) {
            Cookies.set('priviousurl', 'http://chat.thekoushikdurgas.in/', { path: '', domain: '.thekoushikdurgas.in' });
            const fetchData = async () => {
                await userdeatails();
                await getcontactlist();
                await getroomlist();
                setrender(false);
            }
            fetchData();
        }
        if (users.length === 0) { getusers(); }
        socket.on("serverusersinglestatus", (data) => {
            var tempcon = contacts.filter(function (x) {
                if (x.email === data.user) { x.status = data.status; return x; }
                else { return x; }
            });
            if (data.user !== undefined && data.user !== Cookies.get('useremail') && contactsno === tempcon.length) {
                setcontacts(tempcon);
            }
        });
    }, [render, users, socket]);
    return (
        <>
            {users.length !== 0 ? (
                <div className="overflow-hidden md:w-[90%] w-full">
                    <div className="h-full flex flex-col w-full md:rounded-[1vw] rounded-[0] bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border-[2px] border-[#ffffff80] backdrop-blur-[5px]">
                        <div className="p-[9px]">
                            <div className="flex items-center justify-between">
                                <div className='flex items-center gap-2'>
                                    <div className={`w-[40px] h-[40px] rounded-full cursor-pointer border ${status === 'online' ? 'border-[#2ecc71]' : ''} ${status === 'away' ? 'border-[#f1c40f]' : ''} ${status === 'busy' ? 'border-[#e74c3c]' : ''} ${status === 'offline' ? 'border-[#95a5a6]' : ''}`}><div className='w-[40px] overflow-hidden rounded-full'><img src={userimg} className={`w-[37px] h-[37px] scale-110 mainmenu`} alt={username} onClick={() => { setstatusoptions(!statusoptions) }} /></div></div>
                                    <div className='flex flex-col'>
                                        <p className='font-semibold'>{username}</p>
                                        <p className='text-[11px] opacity-50'>{userusername}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2 text-[19px] leading-[0]'>
                                    <Link to='/'><i className="tkd1-Home cursor-pointer"></i></Link>
                                    <i className="tkd2-messages cursor-pointer"></i>
                                    <i className="tkd2-menu mainmenu cursor-pointer" onClick={() => { setmenu(!menu) }} ></i>
                                </div>
                                <div className={`w-[112px] leading-[1] absolute top-[26px] left-[-46px] opacity-0 z-[1000] origin-top bg-white rounded-[6px] text-tkd2 shadow-[0_20px_50px_#00000026] p-[5px] before:content-[""] before:absolute before:w-[0] before:h-[0] before:border-l-[6px] before:border-l-[transparent] before:border-r-[6px] before:border-r-[transparent] before:border-b-[8px] before:border-b-white md:before:ml-[0] before:top-[-8px] ${statusoptions ? 'top-[60px] left-[16px] scale-100 opacity-100 visible' : 'invisible scale-0'}`}>
                                    <ul className='overflow-hidden rounded-[6px] grid gap-1 justify-items-stretch text-center'>
                                        <li className={`p-[4px_5px] cursor-pointer rounded-[6px] hover:bg-tkd2 hover:text-white border-[2px] ${status === 'online' ? 'border-[#2ecc71]' : ''} text-[#2ecc71]`} onClick={() => { usersetstatus('online') }}>Online</li>
                                        <li className={`p-[4px_5px] cursor-pointer rounded-[6px] hover:bg-tkd2 hover:text-white border-[2px] ${status === 'away' ? 'border-[#f1c40f]' : ''} text-[#f1c40f]`} onClick={() => { usersetstatus('away') }}>Away</li>
                                        <li className={`p-[4px_5px] cursor-pointer rounded-[6px] hover:bg-tkd2 hover:text-white border-[2px] ${status === 'busy' ? 'border-[#e74c3c]' : ''} text-[#e74c3c]`} onClick={() => { usersetstatus('busy') }}>Busy</li>
                                        <li className={`p-[4px_5px] cursor-pointer rounded-[6px] hover:bg-tkd2 hover:text-white border-[2px] ${status === 'offline' ? 'border-[#95a5a6]' : ''} text-[#95a5a6]`} onClick={() => { usersetstatus('offline') }}>Offline</li>
                                    </ul>
                                </div>
                                <div className={`w-[190px] leading-[1] absolute top-[31px] right-[20px] opacity-0 z-[1000] origin-[top_right] bg-white rounded-[6px] text-tkd2 shadow-[0_20px_50px_#00000026] p-[5px] before:content-[""] before:absolute before:w-[0] before:h-[0] before:border-l-[6px] before:border-l-[transparent] before:border-r-[6px] before:border-r-[transparent] before:border-b-[8px] before:border-b-white before:top-[-8px] before:right-[8px] ${menu ? 'top-[48px] right-[5px] w-[217px] scale-100 opacity-100 visible' : 'invisible scale-0'}`}>
                                    <ul className='overflow-hidden rounded-[6px] grid gap-1 justify-items-stretch'>
                                        <li className={`p-[4px_5px] gap-1 cursor-pointer flex items-center rounded-[6px] mb-[3px] hover:bg-tkd2 hover:text-white`} onClick={() => { setmenu(false); setleftside(1) }}><i className='tkd6-beveled-star m-0'></i><p>Starred messages</p></li>
                                        <li className={`p-[4px_5px] gap-1 cursor-pointer flex items-center rounded-[6px] mb-[3px] hover:bg-tkd2 hover:text-white`} onClick={() => { navigate(`/club/create`, { replace: true }) }}><i className='tkd10-plus-round-line m-0'></i><p>Create Room</p></li>
                                        <li className={`p-[4px_5px] gap-1 cursor-pointer flex items-center rounded-[6px] mb-[3px] hover:bg-tkd2 hover:text-white`} onClick={() => { setmenu(false); setleftside(2) }}><i className='tkd2-settings m-0'></i><p>Settings</p></li>
                                        <li className={`p-[4px_5px] gap-1 cursor-pointer flex items-center rounded-[6px] mb-[3px] hover:bg-tkd2 hover:text-white`} onClick={() => { deleteapidefault(); }}><i className='tkd4-iconmonstr-log-out-9 m-0'></i><p>Log out</p></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className={`flex bottom-bar w-full border-t border-[#ffffff80] ${leftside === 3 || leftside === 4 ? 'hidden' : ''}`}>
                            <button className="addcontact py-[10px] w-1/2 border-[0] hover:text-tkd2 flex items-center gap-2 justify-center" onClick={() => { setleftside(3) }}><i className="tkd4-iconmonstr-user-10 text-[19px]"></i> <span>Add Contact</span></button>
                            <button className="addcontact w-1/2 border-[0] hover:text-tkd2 flex items-center gap-2 justify-center border-l border-[#ffffff80]" onClick={() => { setleftside(4) }}><i className="tkd4-iconmonstr-user-25 text-[19px]"></i> <span>Add Room</span></button>
                        </div>
                        <div className={`w-full h-[80vh] ${leftside === 0 ? 'flex' : 'hidden'}`}>
                            <div className='w-1/2'>
                                <div className={`border-t border-b border-[#ffffff80] flex`}>
                                    <label htmlFor="search" className='w-[44px] items-center justify-center bg-[#ffffff1a]  hidden md:flex'><i className="tkd2-search2"></i></label>
                                    <input type="text" placeholder="Search contacts..." name='search' className='p-[10px] md:p-[10px_0] w-full border-[none] bg-[#ffffff1a] focus:outline-[none] placeholder:text-textcolor' />
                                </div>
                                <div className='p-[10px] pb-[35px] h-full overflow-y-scroll overflow-x-hidden' style={{ background: `url("//koushikchandrasaha.thekoushikdurgas.in/svg/tkd/Chatbg.svg")` }}>
                                    <ul className='flex flex-wrap'>
                                        {contacts.map((t, i) => {
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
                                    <input type="text" placeholder="Search rooms..." name='search' className='p-[10px] md:p-[10px_0] w-full border-[none] bg-[#ffffff1a] focus:outline-[none] placeholder:text-textcolor' />
                                </div>
                                <div className='p-[10px] pb-[35px] h-full overflow-y-scroll overflow-x-hidden' style={{ background: `url("//koushikchandrasaha.thekoushikdurgas.in/svg/tkd/Chatbg.svg")` }}>
                                    <ul className='flex flex-wrap'>
                                        {rooms.map((t, i) => {
                                            return (
                                                <li className={`w-full m-[10px] md:rounded-[1vw] rounded-[10px] relative p-[10px] text-[0.9em] cursor-pointer bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border-[2px] backdrop-blur-[5px] ${t.status === 'online' ? 'border-[#2ecc71]' : ''} ${t.status === 'away' ? 'border-[#f1c40f]' : ''} ${t.status === 'busy' ? 'border-[#e74c3c]' : ''} ${t.status === 'offline' ? 'border-[#95a5a6]' : ''}`} key={i} onClick={() => { navigate(`/club/${t.authtoken}`, { replace: true }) }}>
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
                        </div>
                        <div className={`w-full h-[80vh] ${leftside === 3 ? '' : 'hidden'}`}>
                            <div className='text-[20px] flex items-center border-t border-[#ffffff80]'><i className="tkd2-arrow-narrow-left w-[44px] h-[44px] flex items-center justify-center" onClick={() => { setleftside(0); getcontactlist(); }}></i><i className='tkd4-iconmonstr-user-10 w-[44px] h-[44px] flex items-center justify-center'></i><span>Add contact</span></div>
                            <div className={`border-t border-b border-[#ffffff80] h-[10%] flex`}>
                                <label htmlFor="search" className='w-[44px] items-center justify-center bg-[#ffffff1a]  hidden md:flex'><i className="tkd2-search2"></i></label>
                                <input type="text" placeholder="Search contacts..." name='search' className='p-[10px] md:p-[10px_0] w-full border-[none] bg-[#ffffff1a] focus:outline-[none] placeholder:text-textcolor' onChange={(event) => { setuser(searchjson(event.target.value)) }} />
                            </div>
                            <div className='p-[10px] h-[80%] overflow-x-scroll overflow-y-hidden' style={{ background: `url("//koushikchandrasaha.thekoushikdurgas.in/svg/tkd/Chatbg.svg")` }}>
                                <ul className='flex flex-wrap'>
                                    {user.map((t, i) => {
                                        return (
                                            <li className={`w-fit m-[10px] md:rounded-[1vw] rounded-[10px] relative p-[10px] text-[0.9em] cursor-pointer  bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border border-[#ffffff80] backdrop-blur-[5px]`} key={i}>
                                                <div className="flex gap-2 items-center">
                                                    <div className="w-[40px] h-[40px] rounded-full cursor-pointer"><div className='w-[40px] overflow-hidden rounded-full'><img src={t.picimg} alt={t.name} className="w-[37px] h-[37px] scale-110" /></div></div>
                                                    <div className='flex flex-col'>
                                                        <p className='font-semibold'>{t.name}</p>
                                                        <p className='text-[11px] opacity-50'>{t.username}</p>
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
            ) : (<Loading />)}
        </>
    )
}
