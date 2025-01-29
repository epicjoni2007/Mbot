import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import './App.css'
import Layout from './components/Layout'
import Home from './components/Home'
import Joystick from './components/Joystick'
import RouteDefine from './components/RouteDefine'
import Karte from './components/Karte'
import NoPage from './components/NoPage'

function App() {
  return (
    <div id='container1'>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="joystick" element={<Joystick />} />
              <Route path="routedefine" element={<RouteDefine />} />
              <Route path="karte" element={<Karte />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
