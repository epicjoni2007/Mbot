import cyberpi
import time
import usocket
import ujson
import mbot2

# WLAN-Konfiguration
cyberpi.network.config_sta("htljoh-public", "joh12345")
while not cyberpi.network.is_connect():
    cyberpi.led.on(255, 0, 0)
    time.sleep(1)
cyberpi.led.on(0, 255, 0)

# HTTP-Server starten
ip = cyberpi.network.get_ip()
port = 8080
s = usocket.socket(usocket.AF_INET, usocket.SOCK_STREAM)
s.setsockopt(usocket.SOL_SOCKET, usocket.SO_REUSEADDR, 1)
s.bind((ip, port))
s.listen(5)

cyberpi.console.println(ip)
cyberpi.console.println(port)

# Liste zur Speicherung der Strecke und Drehung
track = []
recording = False
current_command = None
start_time = None

# Kalibrierung der Drehgeschwindigkeit (Schritte pro Grad) - für diesen Fall musst du kalibrieren
steps_per_degree = 5  # Beispielwert - kalibriere diesen Wert auf Basis von Tests

def send_response(client, status_code, body):
    response = "HTTP/1.1 {} OK\r\nContent-Type: application/json\r\nContent-Length: {}\r\n\r\n{}".format(status_code, len(ujson.dumps(body)), ujson.dumps(body))
    client.send(response)

def parse_request(request):
    try:
        header, body = request.split("\r\n\r\n", 1)
    except ValueError:
        header, body = request, ''
    lines = header.split("\r\n")
    method, path, _ = lines[0].split()
    return method, path, body

def record_movement():
    global track, current_command, start_time
    if current_command and start_time:
        direction, speed = current_command
        duration = time.time() - start_time
        distance = (speed / 100) * duration  # Berechnung der zurückgelegten Strecke basierend auf der Zeit
        
        # Berechnung der Drehung in Grad basierend auf der Dauer der Drehung und der Geschwindigkeit
        turn_degrees = 0
        if direction == "left" or direction == "right":
            steps = int(speed * steps_per_degree * duration)  # Berechnung der Schritte
            turn_degrees = steps / steps_per_degree  # Umrechnung der Schritte in Grad

        track.append({"direction": direction, "speed": speed, "duration": duration, "distance_cm": distance, "turn_degrees": turn_degrees})
        start_time = time.time()

def replay_track():
    for step in track:
        direction = step["direction"]
        speed = step["speed"]
        duration = step["duration"]

        if direction == "forward":
            mbot2.forward(speed)
        elif direction == "backward":
            mbot2.backward(speed)
        elif direction == "left":
            mbot2.turn_left(speed)
        elif direction == "right":
            mbot2.turn_right(speed)
        
        time.sleep(duration)
    
    cyberpi.mbot2.drive_power(0, 0)  # Stop the mBot after replay

def handle_request(client):
    global recording, track, current_command, start_time
    try:
        request = client.recv(1024).decode("utf-8")
        cyberpi.console.println(request)
        method, path, body = parse_request(request)
        
        if method == "POST" and path == "/start_recording":
            track = []
            recording = True
            start_time = time.time()
            send_response(client, 200, {"message": "Recording started"})
        
        elif method == "POST" and path == "/stop_recording":
            if recording:
                record_movement()
            recording = False
            send_response(client, 200, {"message": "Recording stopped", "track": track})
        
        elif method == "GET" and path == "/get_track":
            send_response(client, 200, {"track": track})
        
        elif method == "POST" and path == "/move":
            try:
                data = ujson.loads(body)
                direction = data.get('direction', 'stop')
                speed = data.get('speed', 0)
                
                if speed == 0:
                    if recording:
                        record_movement()
                    cyberpi.mbot2.drive_power(0, 0)
                    current_command = None
                else:
                    if recording and current_command:
                        record_movement()
                    current_command = (direction, speed)
                    start_time = time.time()
                    if direction == "forward":
                        mbot2.forward(speed)
                    elif direction == "backward":
                        mbot2.backward(speed)
                    elif direction == "left":
                        mbot2.turn_left(speed)
                    elif direction == "right":
                        mbot2.turn_right(speed)
                
                send_response(client, 200, {"message": "Movement executed"})
            except (ValueError, KeyError):
                send_response(client, 400, {"error": "Invalid movement data"})
        
        elif method == "POST" and path == "/replay":
            if track:
                replay_track()
                send_response(client, 200, {"message": "Replay started"})


        else:
            send_response(client, 404, {"error": "Not found"})
    except Exception as e:
        send_response(client, 500, {"error": "Server error: " + str(e)})

while True:
    try:
        client, addr = s.accept()
        cyberpi.console.println("Verbindung von " + str(addr))
        handle_request(client)
    except Exception as e:
        cyberpi.console.println("Fehler: " + str(e))
    finally:
        client.close()
