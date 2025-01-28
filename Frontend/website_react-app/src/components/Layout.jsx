import { Outlet, Link } from "react-router-dom"
import '../css/Layout.css'

const Layout = () => {
    return(
        <div id="layout">
            <div id="layouttop">
                <div class="burger-menu">
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                </div>
            </div>
            <div id="sensorwerte">

            </div>

            <Outlet />
        </div>
    )
}

export default Layout