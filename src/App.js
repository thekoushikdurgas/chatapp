import React from 'react';
import "./App.css";
import SunMoon from "./SunMoon";
import Fullscreen from "./Fullscreen";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Main from './Main';
import Room from './Room';
import Error404 from './404';
import Dashboard from './Dashboard';
import Roomcreate from './Roomcreate';
import Cookies from 'js-cookie';
const { io } = require("socket.io-client");

export default function App() {
  const [render, setrender] = React.useState(true);
  const host = "http://localhost:8000";
  // const host = "https://thekoushikdurgasserver.herokuapp.com";
  const socket = io(host);
  // window.oncontextmenu = function () {
  //   console.log("Right Click Disabled");
  //   return false;
  // };
  React.useEffect(() => {
    if (render) {
      socket.emit("joinsingleroom", Cookies.get('useremail'));
      setrender(false);
    }
    if (Cookies.get('userauthtoken') === undefined) {
      window.location.assign("http://login.thekoushikdurgas.in/");
    }
  }, [render, socket]);
  return (
    <>
      <SunMoon />
      <Router>
        <Routes>
          <Route extact path="/" element={<Dashboard host={host} socket={socket} />} />
          <Route extact path="/chat/:id" element={<Main host={host} socket={socket} />} />
          <Route extact path="/club/create" element={<Roomcreate host={host} socket={socket} />} />
          <Route extact path="/club/:id" element={<Room host={host} socket={socket} />} />
          <Route exact path="/404" element={<Error404 host={host} socket={socket} />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Router>
      <div className="absolute top-0 right-0 z-[1] hidden md:block"><Fullscreen /></div>
    </>
  )
}
