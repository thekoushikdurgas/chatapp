/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";

export default function Roomcreate({ host }) {
  const navigate = useNavigate();
  const [render, setrender] = useState(true);
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [logintogglePassword, setlogintogglePassword] = useState(true);
  const [alertactive, setalertactive] = useState([false, '', '']);
  const [mode, setmode] = useState(null);
  const getpassword = async (n) => {
    const response = await fetch(`${host}/api/password/` + n, {
      method: 'GET', headers: { 'Content-Type': 'application/json', }
    });
    const json = await response.json();
    setpassword(json[n]);
    setcpassword(json[n]);
  }
  const submitbutton = async (e) => {
    e.preventDefault();
    if (name === "") { setalertactive([true, 'Warning', 'Room name is mandatory']); }
    else if (password === "") { setalertactive([true, 'Warning', 'Password is mandatory']); }
    else if (password !== cpassword) { setalertactive([true, 'Warning', 'Password and Confirm Password not same']); }
    else {
      const response = await fetch(`${host}/api/createroom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userauthtoken': Cookies.get('userauthtoken'),
        },
        body: JSON.stringify({ name, picimg: 'http://koushikchandrasaha.thekoushikdurgas.in/publicimg/contactprofile.jpg', password, mode })
      });
      const json = await response.json();
      if (json['success']) {
        Cookies.set('roomauthtoken', json['authtoken']);
        navigate(`/club/${json['authtoken']}`, { replace: true });
      } else {
        setalertactive([true, 'Warning', json['error']]);
        // setuserlogin(true);
      }
    }
  }
  useEffect(() => {
    if (render) {
      async function fetchData() {
        // if (country.length === 0) { getcountry(); }
        // else {
        // changephone(countryname);
        // changedayno(year, month);
        // checkpassword(password);
        await getpassword(16);
        setrender(false);
        // }
      }
      fetchData();
    }
  }, [render])
  return (
    <>
      <Alert alertactive={alertactive} />
      <div className="flex items-center justify-center">
        <div className="md:p-[1vh_1vw] p-[21px_14px] pt-[0] grid justify-items-center gap-5 relative animate-[0.7s_ease_0s_1_normal_none_running_zoomin] select-none md:rounded-[1vw] rounded-[10px] bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border border-[#ffffff80] backdrop-blur-[5px] font-['Acme'] text-[20px] md:text-[2vw]">
          <h1 className="sticky top-[0] w-fit rounded-[0_0_10px_10px] md:rounded-[0_0_1vw_1vw] px-[10px] md:px-[1vw] z-[200] m-[0_auto] bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border border-t-0 border-[#ffffff80] backdrop-blur-[5px]">Room Create</h1>
          <input type="text" className="h-full w-full bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border border-[#ffffff80] backdrop-blur-[5px] rounded-[10px] md:rounded-[1vw] md:p-[1vh_1vw] p-[0.375rem_0.75rem]" name="fullname" placeholder="Room Name" value={name} onChange={(event) => { setname(event.target.value); }} />
          <div className="flex flex-wrap gap-1 m-auto">
            <input type="radio" className='fixed w-0 opacity-0' name="modere" id="public" value="public" onChange={() => { setmode('public') }} checked={mode === 'public' ? true : false} />
            <label htmlFor="public" className={`md:p-[1vh_1vw] p-[7px] text-tkd2 bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border border-[#ffffff80] backdrop-blur-[5px] rounded-[10px] md:rounded-[1vw] cursor-pointer flex items-center justify-center gap-2${mode === 'public' ? ' bg-white text-tkd2' : ''}`}><i className="tkd8-connected-people" /><span>Public</span></label>
            <input type="radio" className='fixed w-0 opacity-0' name="modere" id="private" value="private" onChange={() => { setmode('private') }} checked={mode === 'private' ? true : false} />
            <label htmlFor="private" className={`md:p-[1vh_1vw] p-[7px] text-tkd2 bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border border-[#ffffff80] backdrop-blur-[5px] rounded-[10px] md:rounded-[1vw] cursor-pointer flex items-center justify-center gap-2${mode === 'private' ? ' bg-white text-tkd2' : ''}`}><i className="tkd10-private" /><span>Private</span></label>
          </div>
          <div className="md:w-full w-full md:h-[7vh] h-[45px] relative flex items-center justify-around">
            <input type={logintogglePassword ? 'password' : 'text'} name="loginpassword" value={password} placeholder="Password" autoComplete="off" required className={`h-full w-full bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border border-[#ffffff80] backdrop-blur-[5px] rounded-[10px] md:rounded-[1vw] md:p-[1vh_1vw] p-[0.375rem_0.75rem] `} onChange={(event) => { setpassword(event.target.value); }} />
            <i className={`absolute right-[10px] top-[22%] ${logintogglePassword ? 'tkd4-iconmonstr-eye-3' : 'tkd3-nc-sample-glyph_ui-eye-ban'}`} id="logintogglePassword" onClick={() => { setlogintogglePassword(!logintogglePassword) }}></i>
          </div>
          <div className="md:w-full w-full md:h-[7vh] h-[45px] relative flex items-center justify-around">
            <input type={logintogglePassword ? 'password' : 'text'} name="loginpassword" value={cpassword} placeholder="Password" autoComplete="off" required className={`h-full w-full bg-[#ffffff1a] shadow-[0_20px_50px_#00000026] border border-[#ffffff80] backdrop-blur-[5px] rounded-[10px] md:rounded-[1vw] md:p-[1vh_1vw] p-[0.375rem_0.75rem] `} onChange={(event) => { setcpassword(event.target.value); }} />
            <i className={`absolute right-[10px] top-[22%] ${logintogglePassword ? 'tkd4-iconmonstr-eye-3' : 'tkd3-nc-sample-glyph_ui-eye-ban'}`} id="logintogglePassword" onClick={() => { setlogintogglePassword(!logintogglePassword) }}></i>
          </div>
          <button className="active:scale-[0.9] tracking-[1px] uppercase w-fit xl:p-[2vh_2vw] p-[15px_30px] bg-backgroundcolor md:rounded-[2vw] rounded-[20px] shadow-[inset_5px_5px_15px_#96969680,inset_-5px_-5px_15px_#00000080,3px_3px_5px_#000000b3] leading-[0]" onClick={(event) => { submitbutton(event) }}>Create Room</button>
          <div className="text-center text-sm text-grey-dark flex gap-2"> By signing up, you agree to the<a className="no-underline border-b border-grey-dark text-grey-dark" href="/">Terms of Service</a> and<a className="no-underline border-b border-grey-dark text-grey-dark" href="/">Privacy Policy</a></div>
        </div>
      </div>
    </>
  )
}