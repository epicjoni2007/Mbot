import { Outlet, Link } from "react-router-dom"
import { useState } from "react"
import '../css/Layout.css'

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const toggleModal = () => {
        setModalOpen(!modalOpen)
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
                <div>Hindernisdistanz: 2,12 m</div>
                <div>Geschwindigkeit: 5 km/h</div>
                <div id="successconnect">Verbunden<i className="uil uil-check-circle"></i></div>
                {/* <div id="failedconnect">Getrennt<i class="uil uil-cloud-slash"></i></div> */}
            </div>

            <div id="layoutcontent">
                <div id="sidebar" className={sidebarOpen ? "open" : ""}>
                    {sidebarOpen &&
                    <div id="layoutlinkscontainer">
                        <Link onClick={toggleSidebar} to="/home" className="layoutlink">Home</Link>
                        <Link onClick={toggleSidebar} to="/joystick" className="layoutlink">JoyStick</Link>
                        <Link onClick={toggleSidebar} to="/routedefine" className="layoutlink">Route</Link>
                        <Link onClick={toggleSidebar} to="/karte" className="layoutlink">Karte</Link>
                    </div>}
                </div>
                <div id="othercontent">
                    <Outlet />
                </div>
            </div>

            {modalOpen && (
                <div id="modal">
                    <div id="modal-overlay" onClick={toggleModal}></div>
                    <div id="modal-content">
                        <div id="contentcontainer">
                            <div id="sidebarsettings">

                            </div>
                            <div id="settingstab">
                                
                            </div>
                        </div>
                        <i onClick={toggleModal} class="uil uil-times xicon"></i>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Layout