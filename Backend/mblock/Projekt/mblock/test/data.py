import socket
import json
 
# Ziel-IP und Port
TARGET_IP = "10.10.1.28"  # IP-Adresse des mBot2
TARGET_PORT = 1235
 
def send_command(direction, speed, r=0, g=0, b=0):
    # Befehl erstellen
    command = {
        "direction": direction,
        "speed": speed,
        "R": r,
        "G": g,
        "B": b
    }
 
    # Socket erstellen und Daten senden
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.sendto(json.dumps(command).encode("utf-8"), (TARGET_IP, TARGET_PORT))
        print(f"Befehl gesendet: {command}")
 
# Beispiel: Steuerung mit Joystick
while True:
    print("Optionen: forward, backward, left, right, stop")
    direction = input("Richtung eingeben: ")
    speed = int(input("Geschwindigkeit (0-100): "))
    send_command(direction, speed, r=0, g=255, b=0)