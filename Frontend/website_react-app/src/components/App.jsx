import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
import './App.css'
import Layout from './components/Layout'
import Home from './components/Home'
import Joystick from './components/Joystick'
import RouteDefine from './components/RouteDefine'
import Karte from './components/Karte'
import NoPage from './components/NoPage'
import FirstConfig from "./components/FirstConfig"

function App() {
  const [showFirstConfig, setShowFirstConfig] = useState(true)
  const [IpName, setIpName] = useState([])
  
  return (
    <div id='container1'>
      {showFirstConfig ? (
        <FirstConfig onComplete={setShowFirstConfig} newData={setIpName}/>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout ip={IpName[0]}/>}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<Home IpName={IpName}/>} />
              <Route path="joystick" element={<Joystick ip={IpName[0]}/>} />
              <Route path="routedefine" element={<RouteDefine ip={IpName[0]}/>} />
              <Route path="karte" element={<Karte ip={IpName[0]}/>} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </div>
  )
}

export default App
