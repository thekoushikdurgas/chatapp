import React from 'react';
import "./App.css";
import SunMoon from "./SunMoon";
import Fullscreen from "./Fullscreen";
import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";
import Main from './Main';
import Room from './Room';
import Error404 from './404';
import Dashboard from './Dashboard';

export default function App() {
  // window.oncontextmenu = function () {
  //   console.log("Right Click Disabled");
  //   return false;
  // };
  return (
    <>
      <SunMoon />
      <Router>
        <Routes>
          <Route extact path="/" element={<Dashboard />} />
          <Route extact path="/chat/:id" element={<Main />} />
          <Route extact path="/club/:id" element={<Room />} />
          <Route exact path="/404" element={<Error404 />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Router>
      <div className="absolute top-0 right-0 z-[1]"><Fullscreen /></div>
    </>
  )
}
