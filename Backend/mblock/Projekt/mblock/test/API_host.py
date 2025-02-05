import socket
import json
 
# IP-Adresse des mBot und Port
MBOT_IP = "192.168.1.100"  # Ersetze dies durch die tatsächliche IP-Adresse des mBot
MBOT_PORT = 1235
 
# UDP-Socket erstellen
client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
 
# Funktion zum Senden von Steuerbefehlen
def send_command(direction, speed, r=0, g=0, b=0):
    command = {
        "R": r,
        "G": g,
        "B": b,
        "direction": direction,
        "speed": speed
    }
    try:
        # Nachricht senden
        client_socket.sendto(json.dumps(command).encode(), (MBOT_IP, MBOT_PORT))
        # Antwort vom Server empfangen
        response, _ = client_socket.recvfrom(1024)
        print("Antwort vom mBot:", response.decode())
    except Exception as e:
        print("Fehler beim Senden des Befehls:", e)
 
# Beispielbefehle
send_command("forward", 50, 0, 255, 0)  # Vorwärts fahren mit grüner LED
send_command("left", 30, 255, 255, 0)   # Nach links drehen mit gelber LED
send_command("stop", 0, 255, 0, 0)      # Stoppen mit roter LED