import { useState } from "react"
import "../css/Joystick.css"
import { FaRotateRight, FaRotateLeft } from "react-icons/fa6"

const Joystick = (props) => {

  const [speed, setSpeed] = useState(10)

  const move = (direction) => {
    fetch('http://' + props.ip + ':3500/mbot/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction, speed })
    })
  }

  const stop = () => {
    fetch('http://' + props.ip + ':3500/mbot/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction: "forward", speed: 0 })
    })
  }
  
  return (
    <div className="container">
      <div className="left">
        <div className="speed">
          <label className="inputSpeed">Geschwindigkeit: {speed}</label>
        </div>
        <input
          className="slider"
          type="range"
          min="0"
          max="100"
          step="1"
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))}
        />
      </div>
      <div className="right">
        <div className="arrows">
          <i className="uil uil-arrow-circle-up upGrid" onClick={() => move("forward")}></i>
          <FaRotateRight className="arrow rightGrid" onClick={() => move("right")} />
          <i className="uil uil-arrow-circle-down downGrid" onClick={() => move("backward")}></i>
          <FaRotateLeft className="arrow leftGrid" onClick={() => move("left")} />
          <i className="uil uil-stop-circle stopGrid" onClick={stop}></i>
        </div>
      </div>
    </div>
  )
}

export default Joystick
