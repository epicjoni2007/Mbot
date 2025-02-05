import cyberpi
import time
import usocket
import ujson
import sys

cyberpi.led.on(0, 0, 255)  # Lights up all the LEDs
cyberpi.network.config_sta("htljoh-public", "joh12345")

# Verbindung prüfen
while True:
    if not cyberpi.network.is_connect():
        cyberpi.led.on(255, 0, 0)
        time.sleep(1)
    else:
        cyberpi.led.on(0, 255, 0)
        break

sockaddr = cyberpi.network.get_ip()
cyberpi.console.println(sockaddr)

gateway = cyberpi.network.get_gateway()
cyberpi.console.println(gateway)

s = usocket.socket(usocket.AF_INET, usocket.SOCK_DGRAM)
s.bind((sockaddr, 1235))

name = "SUPERPI"

# Haupt-Loop für Kommunikation und Steuerung
while True:
    # Nachricht senden
    s.sendto(name, ("10.10.3.254", 80))
    time.sleep(1)
    cyberpi.led.on(255, 255, 255)
    time.sleep(0.1)
    cyberpi.led.on(0, 0, 0)
    
    # Nachricht empfangen
    b, adr = s.recvfrom(1024)
    txt = str(b, "utf-8")
    cyberpi.console.println(txt)
    cyberpi.console.println(str(adr))
    data = ujson.loads(txt)
    
    # LEDs basierend auf empfangenen Daten steuern
    cyberpi.led.on(data['R'], data['G'], data['B'])

    # mBot basierend auf empfangenen Daten steuern
    if 'direction' in data and 'speed' in data and 'duration' in data:
        direction = data['direction']  # Richtung: 'forward', 'backward', 'left', 'right', 'stop'
        speed = data['speed']  # Geschwindigkeit (0-100)
        duration = data['duration']  # Dauer in Sekunden

        # Fahren basierend auf der Richtung
        if direction == "forward":
            cyberpi.mbot2.drive_power(speed, -speed)
        elif direction == "backward":
            cyberpi.mbot2.drive_power(-speed, speed)
        elif direction == "left":
            cyberpi.mbot2.drive_power(speed, speed)
        elif direction == "right":
            cyberpi.mbot2.drive_power(-speed, -speed)
        elif direction == "stop":
            cyberpi.mbot2.drive_power(0, 0)

        # Dauer warten und dann stoppen
        time.sleep(duration)
        cyberpi.mbot2.drive_power(0, 0)
