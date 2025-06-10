import { Outlet, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import LedSetting from "./LedSetting"
import '../css/Layout.css'

const Layout = (props) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [openSettingsTab, setOpenSettingsTab] = useState(true)
    const [selectedTab, setSelectedTab] = useState(0)
    const [isConnected, setIsConnected] = useState(true)
    const [ledColor, setLedColor] = useState({
                                        "r": 255,
                                        "g": 255,
                                        "b": 255
                                    })
    const [sensordaten, setSensordaten] = useState([0, 0])

    useEffect(() => {
        const interval = setInterval(() => {
            fetch('http://' + props.ip + ':3500/sensor-data')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('sensorData', JSON.stringify(data))
                setSensordaten([data.distance, data.loudness])
                setIsConnected(true)
            })
            .catch(error => {
                console.error(error)
                setIsConnected(false)
            });
        }, 1000)

        return () => clearInterval(interval)
    }, [])
 
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const toggleModal = () => {
        setModalOpen(!modalOpen)
    }

    const saveSetting = async () => {
        const response = await fetch('http://' + props.ip + ':3500/mbot/led', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ledColor)
        })
        const data = await response.json()
    }

    return (
        <div id="layout">
            <div id="layouttop">
                <div id="burger-menu" onClick={toggleSidebar}>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                <div id="layouttext">
                    <p>MBot-Steuerung</p>
                </div>
                <div id="layoutsettings" onClick={toggleModal}>
                    <i className="uil uil-cog settingsicon"></i>
                </div>
            </div>

            <div id="sensorwerte">
                <div>Hindernisdistanz: {sensordaten[0]} cm</div>
                <div>Lautstärke: {sensordaten[1]}</div>
                {isConnected ? <div id="successconnect">Verbunden<i className="uil uil-check-circle"></i></div> : <div id="failedconnect">Getrennt<i class="uil uil-cloud-slash"></i></div>}
            </div>

            <div id="layoutcontent">
                <div id="sidebar" className={sidebarOpen ? "open" : ""}>
                    {sidebarOpen &&
                    <div id="layoutlinkscontainer">
                        <Link onClick={()=> { toggleSidebar(); setSelectedTab(0) }} to="/home" className={`layoutlink ${selectedTab == 0 ? "selected" : ""}`}>Home</Link>
                        <Link onClick={()=> { toggleSidebar(); setSelectedTab(1) }} to="/joystick" className={`layoutlink ${selectedTab == 1 ? "selected" : ""}`}>JoyStick</Link>
                        <Link onClick={()=> { toggleSidebar(); setSelectedTab(2) }} to="/routedefine" className={`layoutlink ${selectedTab == 2 ? "selected" : ""}`}>Route planen</Link>
                        <Link onClick={()=> { toggleSidebar(); setSelectedTab(3) }} to="/karte" className={`layoutlink ${selectedTab == 3 ? "selected" : ""}`}>Karte erstellen</Link>
                    </div>}
                </div>
                <div id="othercontent">
                    <Outlet />
                </div>
            </div>

            {modalOpen && (
                <div className="modal">
                    <div id="modal-overlay-layout" onClick={toggleModal}></div>
                    <div id="modal-content-layout">
                        <div id="contentcontainer">
                            <div id="sidebarsettings">
                                <div onClick={() => setOpenSettingsTab(true)} className={`settingmenuitem ${openSettingsTab ? "selected" : ""}`}>LED</div>
                            </div>
                            <div id="settingstab">
                                <div id="opensettingstab">{openSettingsTab ? <LedSetting setNewColors={setLedColor}/> : <div>GESCHWINDIGKEIT</div>}</div>
                            </div>
                        </div>
                        <div id="settingsright">
                            <i onClick={toggleModal} className="uil uil-times xicon"></i>
                            <div id="savebutton" onClick={saveSetting}>Save</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Layout