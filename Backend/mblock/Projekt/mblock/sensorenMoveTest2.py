import socket
import json
import cyberpi
import time
import usocket
# Ports definieren
BROADCAST_PORT = 1238  # Port für eingehenden Broadcast
CONTROL_PORT = 1235    # Port für Steuerbefehle
cyberpi.network.config_sta("htljoh-public", "joh12345")
#cyberpi.wifi.connect("htljoh-public", "joh12345")

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

# Antwort auf Broadcast
BROADCAST_RESPONSE = "CONTROL_HUB"
 
# Socket für Broadcast erstellen
broadcast_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
broadcast_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
broadcast_socket.bind((sockaddr, BROADCAST_PORT))
 
# Socket für Steuerbefehle erstellen
control_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
control_socket.bind(("", CONTROL_PORT))
 
print("Steuergerät läuft und wartet auf Verbindungen...")
 
# Hauptloop: Verarbeite Broadcasts und Steuerbefehle
while True:
    # Prüfe auf Broadcast-Anfragen
        broadcast_socket.settimeout(1)  # Timeout von 1 Sekunde
        data = broadcast_socket.recvfrom(1024)
        addr = broadcast_socket.recvfrom(1024)  # Empfangene Daten
        if data.decode("utf-8") == "SUPERPI":
            print("Broadcast-Anfrage von {addr[0]}")
            # Antwort an den mBot2
            broadcast_socket.sendto(BROADCAST_RESPONSE.encode("utf-8"), addr)
            print("Antwort an {addr[0]} gesendet: {BROADCAST_RESPONSE}")
 
    # Prüfe auf Steuerbefehle
        control_socket.settimeout(1)  # Timeout von 1 Sekunde
        data, addr = control_socket.recvfrom(1024)  # Empfangene Daten
        command = json.loads(data.decode("utf-8"))
        print("Steuerbefehl erhalten von {addr[0]}: {command}")
 
        # Hier könnte der Befehl verarbeitet werden, z. B.:
        direction = command.get("direction")
        speed = command.get("speed")
        r, g, b = command.get("R"), command.get("G"), command.get("B")
        print("Bewegung: {direction}, Geschwindigkeit: {speed}, Farbe: R={r}, G={g}, B={b}")