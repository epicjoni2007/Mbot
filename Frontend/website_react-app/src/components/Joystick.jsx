import { useState } from "react";
import "../css/Joystick.css"

const Joystick = () => {
  const [speed, setSpeed] = useState(10);

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

        <div className="arrows">
          <i className="uil uil-arrow-circle-up"></i>
          <i className="uil uil-arrow-circle-right"></i>
          <i className="uil uil-arrow-circle-down"></i>
          <i className="uil uil-arrow-circle-left"></i>
          <i className="uil uil-stop-circle"></i>
        </div>
      </div>

      <div className="right">
        <img className="coban" src="coban.png" alt="" />
      </div>
    </div>
  );
}

export default Joystick