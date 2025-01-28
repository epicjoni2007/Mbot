import { BrowserRouter, Routes, Route } from "react-router-dom"
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
                <Route index element={<Home />} />
                <Route path="youtube" element={<Joystick />} />
                <Route path="orfnews" element={<RouteDefine />} />
                <Route path="contact" element={<Karte />} />
                <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App
