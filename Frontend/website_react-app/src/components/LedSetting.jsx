import { ChromePicker } from "react-color"
import { useState } from "react"

const LedSetting = ({setNewColors}) => {
    const [color, setColor] = useState("#ff0000")

    const handleColorChange = (color) => {
        setColor(color.hex)
        const { r, g, b } = color.rgb
        setNewColors({
            "R": r,
            "G": g,
            "B": b
        })
    }

    return(
        <div id="ledsetting">
            <div className="setting">
                <div className="settingdescriptor">
                    Farbe ändern:
                </div>
                <ChromePicker color={color} onChange={handleColorChange} />
            </div>
        </div>
    )
}

export default LedSetting