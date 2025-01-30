import { useState } from "react"
import '../css/FirstConfig.css'

function FirstConfig({ onComplete }) {
  const [ipAddress, setIpAddress] = useState("")
  const [username, setUsername] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const sendData = () => {
    if (!ipAddress || !username) {
        setErrorMessage("Bitte alle Felder ausfüllen!")
    }else {
        onComplete(false)
    }
  }

  return (
    <div id="modal-overlay-config">
      <div id="modal-content-config">
        <div id="firstconfigtitle">IP-Konfiguration</div>
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