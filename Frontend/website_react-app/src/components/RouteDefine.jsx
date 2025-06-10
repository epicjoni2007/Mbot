import { useRef, useState, useEffect } from 'react'
import '../css/RouteDefine.css'

const RouteDefine = (props) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [steps, setSteps] = useState([])
  const [currentPosition, setCurrentPosition] = useState(null)
  const [context, setContext] = useState(null)
  const [isLandscape, setIsLandscape] = useState(window.matchMedia("(orientation: landscape)").matches)
  const [speed, setSpeed] = useState(10)

  const stepSize = 20

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = 2
    ctx.strokeStyle = '#00D1FF'
    setContext(ctx)
    const mediaQuery = window.matchMedia("(orientation: landscape)")
    const handleOrientationChange = (e) => setIsLandscape(e.matches)
    mediaQuery.addListener(handleOrientationChange)
    return () => mediaQuery.removeListener(handleOrientationChange)
  }, [])

  const getDirection = (dx, dy) => {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left'
    }
    return dy > 0 ? 'backward' : 'forward'
  }

  const handleStart = (e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    const startX = clientX - rect.left
    const startY = clientY - rect.top

    setIsDrawing(true)
    setCurrentPosition({ x: startX, y: startY })
    setSteps([])

    ctx.beginPath()
    ctx.moveTo(startX, startY)
  }

  const handleMove = (e) => {
    if (!isDrawing || !currentPosition) return
    e.preventDefault()

    const rect = canvasRef.current.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    const mouseX = clientX - rect.left
    const mouseY = clientY - rect.top

    const dx = mouseX - currentPosition.x
    const dy = mouseY - currentPosition.y

    if (dx === 0 && dy === 0) return

    const direction = getDirection(dx, dy)
    const axis = ['left', 'right'].includes(direction) ? 'x' : 'y'
    const distance = axis === 'x' ? Math.abs(dx) : Math.abs(dy)
    const numSteps = Math.floor(distance / stepSize)

    if (numSteps > 0) {
      let newX = currentPosition.x
      let newY = currentPosition.y

      switch (direction) {
        case 'right':
          newX += numSteps * stepSize
          break
        case 'left':
          newX -= numSteps * stepSize
          break
        case 'backward':
          newY += numSteps * stepSize
          break
        case 'forward':
          newY -= numSteps * stepSize
          break
        default:
          break
      }

      context.lineTo(newX, newY)
      context.stroke()

      const newSteps = Array(numSteps).fill({ direction, duration: 1000 })
      setSteps(prev => [...prev, ...newSteps])
      setCurrentPosition({ x: newX, y: newY })
    }
  }

  const handleEnd = () => {
    setIsDrawing(false)
    context.closePath()
  }

  const sendRoute = async () => {
    let result = []
    let current = { direction: steps[0].direction, duration: steps[0].duration }
    let first = false

    for (let i = 1; i < steps.length; i++) {
        if (steps[i].direction === current.direction) {
            current.duration += steps[i].duration
        }
        else {
          result.push({ ...current })
          first = false
          current = { direction: steps[i].direction, duration: steps[i].duration }
          first = true
        } 
    }
    result.push({ ...current })

    let summaryArray = []
    for (let j = 0; j < result.length; j++) {
      summaryArray.push({direction: result[j].direction, duration: 1000})
      summaryArray.push({direction: "forward", duration: result[j].duration})
    }
    
    let finalArray = getFinalArray(summaryArray)

    finalArray = finalArray.slice(1)
    finalArray.push({direction: "forward", duration: 1, speed: 0, rotation: 0})

    const response = await fetch('http://' + props.ip + ':3500/mbot/execute-map', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        map: finalArray
      })
    })
    const data = await response.json()
  }

  const getFinalArray = (OldArray) => {
    let currentDirection = "forward"
    let finalArray = []

    const duration180d = 200
    const duration90d = 200
    const speedturn = 20

    for (let k = 0; k < OldArray.length; k++) {
      if(k % 2 == 0) {
        switch (currentDirection) {
          case 'right':
            switch(OldArray[k].direction) {
              case 'forward':
                finalArray.push({direction: "left", duration: duration90d, speed: speedturn, rotation: -90})
                break
              case 'backward':
                finalArray.push({direction: "right", duration: duration90d, speed: speedturn, rotation: 90})
                break
              case 'left':
                finalArray.push({direction: "right", duration: duration180d, speed: speedturn, rotation: 180})
                break
              default:
                console.error("Fehler beim konvertieren des Arrays!")
                break
            }
            break
          case 'left':
            switch(OldArray[k].direction) {
              case 'forward':
                finalArray.push({direction: "right", duration: duration90d, speed: speedturn, rotation: 90})
                break
              case 'backward':
                finalArray.push({direction: "left", duration: duration90d, speed: speedturn, rotation: -90})
                break
              case 'right':
                finalArray.push({direction: "right", duration: duration180d, speed: speedturn, rotation: 180})
                break
              default:
                console.error("Fehler beim konvertieren des Arrays!")
                break
            }
            break
          case 'backward':
            switch(OldArray[k].direction) {
              case 'forward':
                finalArray.push({direction: "right", duration: duration180d, speed: speedturn, rotation: 180})
                break
              case 'right':
                finalArray.push({direction: "left", duration: duration90d, speed: speedturn, rotation: -90})
                break
              case 'left':
                finalArray.push({direction: "right", duration: duration90d, speed: speedturn, rotation: 90})
                break
              default:
                console.error("Fehler beim konvertieren des Arrays!")
                break
            }
            break
          case 'forward':
            switch(OldArray[k].direction) {
              case 'forward':
                finalArray.push({direction: "forward", duration: 0, speed: speedturn, rotation: 0})
                break
              case 'backward':
                finalArray.push({direction: "right", duration: duration180d, speed: speedturn, rotation: 180})
                break
              case 'right':
                finalArray.push({direction: "right", duration: duration90d, speed: speedturn, rotation: 90})
                break
              case 'left':
                finalArray.push({direction: "left", duration: duration90d, speed: speedturn, rotation: -90})
                break
              default:
                console.error("Fehler beim konvertieren des Arrays!")
                break
            }
            break
            
          default:
            console.error("Fehler beim konvertieren des Arrays!")
            break
        }
        currentDirection = OldArray[k].direction
      }
      else {
        finalArray.push({direction: OldArray[k].direction, duration: OldArray[k].duration, speed: speed, rotation: 0})
      }
    }

    return finalArray
  }

  const canvasStyle = isLandscape
    ? { 
        width: `${window.innerWidth * 0.5}px`,
        height: `${window.innerHeight * 0.6}px`,
        border: '1px solid black',
        backgroundColor: '#f0f0f0',
        touchAction: 'none',
        backgroundColor: 'rgba(44, 83, 100, 1)'
      }
    : { 
        width: `${window.innerWidth * 0.7}px`,
        height: `${window.innerHeight * 0.35}px`,
        border: '1px solid black',
        backgroundColor: '#f0f0f0',
        touchAction: 'none',
        backgroundColor: 'rgba(44, 83, 100, 1)',
      }

  return (
    <div id="routedefine">
      <div className="leftroute">
        <canvas
          ref={canvasRef}
          width={isLandscape ? window.innerWidth * 0.5 : window.innerWidth * 0.7}
          height={isLandscape ? window.innerHeight * 0.6 : window.innerHeight * 0.35}
          style={canvasStyle}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>
      <div className="rightroute">
        <div className="routeContainer">
          <label className="inputSpeed">Geschwindigkeit: {speed}</label>
          <div className="placeholderRoute"></div>
        </div>
        <input
            className="routeslider"
            type="range"
            min="0"
            max="100"
            step="1"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
          />
          <div onClick={sendRoute} className="drivebutton">Route senden</div>
      </div>
    </div>
  )
}

export default RouteDefine
