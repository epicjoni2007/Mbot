import { useState, useEffect } from "react"
import "../css/Home.css"
import icon from "/main-icon.png"

const Home = (props) => {
    const[BetrWeg, setBetrWeg] = useState([null, null])

    useEffect(() => {
        const interval = setInterval(() => {
            const storedData = JSON.parse(localStorage.getItem('sensorData'))
            setBetrWeg([0, storedData.timer])
        }, 1000)

        return () => clearInterval(interval)
      }, [])

    return(
        <div id="home">
            {console.log("test: " + BetrWeg)}
            <div id="datatabs">
                <div className="datatab">
                    <div className="datatabtext">
                        IP-Adresse: {props.IpName[0]}
                    </div>
                    <div className="datatabtext">
                        Name: {props.IpName[1]}
                    </div>
                </div>
                <div className="datatab">
                    <div className="datatabtext">
                        Gefahrene Strecke: {BetrWeg[0]}
                    </div>
                    <div className="datatabtext">
                        Betriebsdauer: {BetrWeg[1]}
                    </div>
                </div>
                <img id="homemainicon" src={icon} alt="MBot Icon" />
            </div>
        </div>
    )
}

export default Home