import { useState } from "react"
import '../css/FirstConfig.css'

function FirstConfig({ onComplete }) {
  const [ipAddress, setIpAddress] = useState("")
  const [username, setUsername] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const sendData = () => {
    // if(!isValidIpAddress()) {
    //   setErrorMessage("IP Adresse nicht korrekt eingegeben!")
    //   return
    // }
    // if(!isValidName()) {
    //   setErrorMessage("Name nicht korrekt eingegeben!")
    //   return
    // }
    // if (!ipAddress || !username) {
    //     setErrorMessage("Bitte alle Felder ausfüllen!")
    // }else {
    //     onComplete(false)
    //     return
    // }
    onComplete(false)
  }

  const isValidIpAddress = () => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4][0-9]|1\d{2}|[1-9]?\d)){3}$/
    return ipRegex.test(ipAddress)
  }

  const isValidName = () => {
    const nameRegex = /^[a-zA-Z0-9]{1,10}$/
    return nameRegex.test(username)
  }

  return (
    <div id="modal-overlay-config">
      <div id="modal-content-config">
        <div id="firstconfigtitle">IP-Verbindung</div>
        <div id="datainputfields">
            <div className="datainputfield">
            <label>IP-Adresse</label>
            <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="192.168.1.1"
            />
            </div>
            <div className="datainputfield">
            <label>Name</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ihr Name"
            />
            </div>
            <button onClick={sendData} id="confirmbutton">Bestätigen</button>
        </div>
        {errorMessage && <p id="errormessage">{errorMessage}</p>}
      </div>
    </div>
  )
}

export default FirstConfig