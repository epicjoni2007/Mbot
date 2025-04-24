import cyberpi 
import time
import usocket
import ujson
import mbot2
import mbuild

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

# Liste zur Speicherung der Bewegungen
track = []
recording = False
current_command = None
start_time = None

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

def set_led(r, g, b):
    """Setzt die Farbe der LEDs"""
    cyberpi.led.on(r, g, b)

def record_movement():
    """Speichert die aktuelle Bewegung (Richtung, Geschwindigkeit, Dauer in ms)"""
    global track, current_command, start_time
    if current_command and start_time:
        direction, speed = current_command
        duration_ms = time.ticks_diff(time.ticks_ms(), start_time)

        track.append({"direction": direction, "speed": speed, "duration_ms": duration_ms})
        start_time = time.ticks_ms()

def execute_steps(steps):
    """Führt eine übergebene Map (Liste von Bewegungen) aus"""
    for step in steps:
        direction = step.get("direction", "stop")
        speed = step.get("speed", 0)
        duration_ms = step.get("duration_ms", 0)

        # Bewegung ausführen
        if direction == "forward":
            mbot2.forward(speed)
        elif direction == "backward":
            mbot2.backward(speed)
        elif direction == "left":
            mbot2.turn_left(speed)
        elif direction == "right":
            mbot2.turn_right(speed)
        else:
            cyberpi.mbot2.drive_power(0, 0)  # Stoppen

        # Wartezeit entsprechend der Dauer
        time.sleep_ms(duration_ms)

    # Nach Abschluss anhalten
    cyberpi.mbot2.drive_power(0, 0)

def replay_track():
    """Wiederholt die aufgezeichnete Strecke"""
    execute_steps(track)



def get_sensor_data():
    return {
        "timer": cyberpi.timer.get(),
        "distance": mbuild.ultrasonic2.get(1),
        "yaw": -cyberpi.get_yaw(),
        "loudness": cyberpi.get_loudness("maximum")
    }


def handle_request(client):
    global recording, track, current_command, start_time
    try:
        request = client.recv(1024).decode("utf-8")
        cyberpi.console.println(request)
        method, path, body = parse_request(request)

        # Status endpoint - Check if connected to the network
        if method == "GET" and path == "/status":
            connected = cyberpi.network.is_connect()  # Check if connected to the network
            send_response(client, 200, {"connected": connected})

        elif method == "POST" and path == "/start_recording":
            track = []
            recording = True
            start_time = time.ticks_ms()
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
                    start_time = time.ticks_ms()

                    if direction == "forward":
                        mbot2.forward(speed)
                    elif direction == "backward":
                        mbot2.backward(speed)
                    elif direction == "left":
                        mbot2.turn_left(speed)
                    elif direction == "right":
                        mbot2.turn_right(speed)

                    if mbuild.ultrasonic2.get(1) < 15:
                                mbot2.EM_stop("ALL")
                                mbot2.turn(90)
                    
                    if mbuild.quad_rgb_sensor.get_gray("L2",1) < 10 or mbuild.quad_rgb_sensor.get_gray("R2",1) < 10:
                                mbot2.EM_stop("ALL")
                                mbot2.straight(-5)
                                mbot2.turn(90)
                                
                send_response(client, 200, {"message": "Movement executed"})
            except (ValueError, KeyError):
                send_response(client, 400, {"error": "Invalid movement data"})

        elif method == "POST" and path == "/replay":
            if track:
                replay_track()
                send_response(client, 200, {"message": "Replay started"})

        elif method == "POST" and path == "/execute_map":
            try:
                data = ujson.loads(body)
                steps = data.get("map", [])

                if not isinstance(steps, list):
                    raise ValueError("Invalid map format")

                execute_steps(steps)
                send_response(client, 200, {"message": "Map executed successfully"})
            except (ValueError, KeyError):
                send_response(client, 400, {"error": "Invalid map data"})
                
        elif method == "GET" and path == "/sensor-data":
            send_response(client, 200, get_sensor_data())
    
        elif method == "POST" and path == "/led":
            try:
                data = ujson.loads(body)
                r = int(data.get("R", 0))
                g = int(data.get("G", 0))
                b = int(data.get("B", 0))

                cyberpi.led.on(r, g, b)
                send_response(client, 200, {"message": "LED color set", "r": r, "g": g, "b": b})
            except (ValueError, KeyError):
                send_response(client, 400, {"error": "Invalid LED data"})

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
