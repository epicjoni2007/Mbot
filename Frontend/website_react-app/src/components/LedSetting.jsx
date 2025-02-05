import { HexColorPicker } from "react-colorful"
import { useState } from "react"
import "../css/LedSetting.css"

const ColorfulPicker = ({ setNewColors }) => {
  const [color, setColor] = useState("#ff0000")

  const handleColorChange = (color) => {
    setColor(color)
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)
    setNewColors({ R: r, G: g, B: b })
  }

  return (
    <HexColorPicker className="customcolorpicker" color={color} onChange={handleColorChange} />
  )
}

export default ColorfulPicker