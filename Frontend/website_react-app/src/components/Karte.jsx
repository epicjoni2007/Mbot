import { useState, useRef } from 'react'
import "../css/Karte.css"

const Karte = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const svgRef = useRef(null)

    const startMapCreation = async () => {
        fetch('http://' + props.ip + ':3500/mbot/cartography')
        .then(response => response.json())
        setIsLoading(true)
    }

    const endMapCreation = async () => {
        try {
            let response = await fetch('http://' + props.ip + ':3500/mbot/stopcartography', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: "stop"})
            })
            response = await response.json()
            visualizePoints(response.map_points)
            
        } catch (err) {
            console.error('Fehler beim Laden der Map:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const visualizePoints = (mapPoints) => {
        if (!mapPoints || mapPoints.length === 0) return

        let points = [{ x: 0, y: 0 }]
        let currentAngle = 0
        let currentX = 0
        let currentY = 0

        mapPoints.forEach(point => {
            currentAngle = (currentAngle + point.rotation) % 360
            const angleRad = (currentAngle * Math.PI) / 180

            currentX += Math.cos(angleRad) * point.distance
            currentY += Math.sin(angleRad) * point.distance

            points.push({ x: currentX, y: currentY })
        })

        const svg = svgRef.current
        const allX = points.map(p => p.x)
        const allY = points.map(p => p.y)

        const minX = Math.min(...allX)
        const maxX = Math.max(...allX)
        const minY = Math.min(...allY)
        const maxY = Math.max(...allY)

        const width = maxX - minX
        const height = maxY - minY

        svg.setAttribute('width', width + 40)
        svg.setAttribute('height', height + 40)
        svg.setAttribute('viewBox', `${minX - 20} ${minY - 20} ${width + 40} ${height + 40}`)

        svg.innerHTML = ''

        points.forEach(point => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
            circle.setAttribute('cx', point.x)
            circle.setAttribute('cy', point.y)
            circle.setAttribute('r', '5')
            circle.setAttribute('fill', '#1C2833')
            svg.appendChild(circle)
        })
    }

    return (
        <div id="karte">
            <div className="buttons">
                <button className='buttonCard' onClick={startMapCreation} disabled={isLoading}>Starten</button>
                <button className='buttonCard' onClick={endMapCreation} disabled={!isLoading}>Laden</button>
            </div>
            <div className='svgContainer'>
                <svg ref={svgRef} width="50%" height="99%" />
            </div>
        </div>
    )
}

export default Karte
