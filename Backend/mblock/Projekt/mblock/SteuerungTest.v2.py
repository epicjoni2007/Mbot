import event
import time
import cyberpi
import mbot2
import usocket
import ujson
#import threading

# WLAN-Daten (ändern)
WIFI_SSID = "htljoh-public"
WIFI_PASSWORD = "joh12345"

# UDP Server-Daten (ändern)
SERVER_IP = "10.10.2.216"  # IP-Adresse des Steuer-Servers
SERVER_PORT = 5005           # Port für die Kommunikation

def connect_wifi():
    cyberpi.wifi.connect(WIFI_SSID, WIFI_PASSWORD)
    #cyberpi.network.config_sta(WIFI_SSID, WIFI_PASSWORD)
    time.sleep(5)  # Wartezeit für die Verbindung

    if cyberpi.wifi.is_connect():
        cyberpi.console.println("WLAN verbunden!")
        cyberpi.led.show('green green green green green')
    else:
        cyberpi.console.println("WLAN fehlgeschlagen!")
        cyberpi.led.show('red red red red red')



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
    s.sendto(name, ("10.10.2.216", 80))
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
    if 'direction' in data and 'speed' in data:
        direction = data['direction']  # Richtung: 'forward', 'backward', 'left', 'right', 'stop'
        speed = data['speed']  # Geschwindigkeit (0-100)
        
        if direction == "forward":
            cyberpi.mbot2.drive_power(speed, -speed)
        elif direction == "backward":
            cyberpi.mbot2.drive_power(-speed, -speed)
        elif direction == "left":
            cyberpi.mbot2.drive_power(-speed, speed)
        elif direction == "right":
            cyberpi.mbot2.drive_power(speed, -speed)
        elif direction == "stop":
            cyberpi.mbot2.drive_power(0, 0)


@event.start
def on_start():
    cyberpi.console.clear()
    cyberpi.console.set_font(12)
    cyberpi.console.println("mBot2 mit UDP-Netzwerk")

    connect_wifi()

    # Starte UDP-Listener in separatem Thread
   # listener_thread = threading.Thread(target=udp_listener, daemon=True)
    #listener_thread.start()


@cyberpi.event.mesh_broadcast("forward")
def on_mesh_broadcast():
    cyberpi.mbot2.drive_power(20, -20)
    time.sleep(0.1)
    cyberpi.console.println("move forward 10cm")
    cyberpi.led.on(0, 255, 43, "all")
    cyberpi.mbot2.drive_power(50, -50)


@cyberpi.event.mesh_broadcast("backward")
def on_mesh_broadcast1():
    cyberpi.mbot2.drive_power(-10, 10)
    time.sleep(0.1)
    cyberpi.console.println("move backward 10cm")
    cyberpi.led.on(255, 0, 29, "all")
    cyberpi.mbot2.drive_power(-30, 30)


@cyberpi.event.mesh_broadcast("right")
def on_mesh_broadcast2():
    mbot2.straight(0)
    cyberpi.console.println("turn right 90°")
    cyberpi.led.show('black black blue blue blue')
    cyberpi.mbot2.drive_power(15, 15)


@cyberpi.event.mesh_broadcast("left")
def on_mesh_broadcast3():
    mbot2.straight(0)
    cyberpi.console.println("turn left 90°")
    cyberpi.led.show('blue blue blue black black')
    cyberpi.mbot2.drive_power(-15, -15)


@cyberpi.event.mesh_broadcast("stop")
def on_mesh_broadcast4():
    cyberpi.console.println("stop")
    cyberpi.led.show('blue blue blue black black')
    mbot2.straight(0)
