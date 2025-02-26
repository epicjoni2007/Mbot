import { useState, useEffect } from "react"
import "../css/Home.css"
import icon from "/main-icon.png"

const Home = (props) => {
    const[BetrWeg, setBetrWeg] = useState([])

    useEffect(() => {
        fetch('http://' + props.IpName[0] + ':3000/daten')
        .then(response => response.json())
        .then(data => setBetrWeg([
            data.betriebsDauer,
            data.wegStrecke
        ]))
        return
      }, [])

    return(
        <div id="home">
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