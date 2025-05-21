import cyberpi
import time
import usocket
import ujson
import mbot2
import mbuild
import _thread
import random

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

# Globale Variablen
track = []
recording = False
current_command = None
start_time = None
cartographCheck = False
map_points = []

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
        duration = time.ticks_diff(time.ticks_ms(), start_time)
        track.append({"direction": direction, "speed": speed, "duration": duration})
        start_time = time.ticks_ms()

def execute_steps(steps):
    for step in steps:
        direction = step.get("direction", "stop")
        speed = step.get("speed", 0)
        duration = step.get("duration", 0)

        if direction == "forward":
            mbot2.forward(speed)
        elif direction == "backward":
            mbot2.backward(speed)
        elif direction == "left":
            mbot2.turn_left(speed)
        elif direction == "right":
            mbot2.turn_right(speed)
        else:
            cyberpi.mbot2.drive_power(0, 0)

        time.sleep_ms(duration)

    cyberpi.mbot2.drive_power(0, 0)

def replay_track():
    if not track:
        cyberpi.console.println("Keine Strecke zum Wiederholen!")
        return
    cyberpi.console.println("Starte Wiederholung der Strecke...")
    execute_steps(track)

def cartography_loop():
    global cartographCheck, map_points
    point_counter = 1
    speed_in_rpm = 50
    wheel_diameter_cm = 6.5
    wheel_circumference_cm = 3.1416 * wheel_diameter_cm
    speed_cm_per_sec = (speed_in_rpm / 60) * wheel_circumference_cm

    cyberpi.timer.reset()
    mbot2.forward(speed_in_rpm)

    while cartographCheck:
        distance_sensor = mbuild.ultrasonic2.get(1)
        if distance_sensor < 20:
            time_elapsed = cyberpi.timer.get()
            distance = speed_cm_per_sec * time_elapsed + distance_sensor
            rndm_numb = random.randint(90, 270)
            mbot2.turn(rndm_numb)
            cyberpi.console.println("Zufallsdrehung: " + str(rndm_numb))
            cyberpi.console.println("Gefahrene Strecke: " + str(distance) + " cm")

            point_from = point_counter
            point_counter += 1
            point_to = point_counter

            map_points.append({
                "from": point_from,
                "to": point_to,
                "distance": round(distance, 2),
                "rotation": rndm_numb
            })

            cyberpi.timer.reset()
            mbot2.forward(speed_in_rpm)

        time.sleep(0.1)

    mbot2.forward(0)

def get_sensor_data():
    return {
        "timer": cyberpi.timer.get(),
        "distance": mbuild.ultrasonic2.get(1),
        "yaw": -cyberpi.get_yaw(),
        "loudness": cyberpi.get_loudness("maximum")
    }

def execute_stepsmap(steps):
    for step in steps:
        direction = step.get("direction", "stop")
        speed = step.get("speed", 0)
        duration = step.get("duration", 0)
        rotation = step.get("rotation", 0)

        if rotation != 0:
            mbot2.drive_speed(0, 0)
            time.sleep_ms(1000)
            mbot2.turn(rotation)
        elif direction == "forward":
            mbot2.forward(speed)
        elif direction == "backward":
            mbot2.backward(speed)
        elif direction == "left":
            mbot2.turn_left(speed)
        elif direction == "right":
            mbot2.turn_right(speed)
        else:
            mbot2.drive_speed(0, 0)

        time.sleep_ms(duration)

    mbot2.drive_speed(0, 0)

def handle_request(client):
    global recording, track, current_command, start_time, cartographCheck, map_points

    try:
        request = client.recv(1024).decode("utf-8")
        cyberpi.console.println(request)
        method, path, body = parse_request(request)

        if method == "GET" and path == "/status":
            connected = cyberpi.network.is_connect()
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

        elif method == "GET" and path == "/sensor-data":
            send_response(client, 200, get_sensor_data())

        elif method == "GET" and path == "/get_track":
            send_response(client, 200, {"track": track})

        elif method == "GET" and path == "/cartography":
            if not cartographCheck:
                cartographCheck = True
                map_points = []
                _thread.start_new_thread(cartography_loop, ())
                send_response(client, 200, {"message": "Cartography started"})
            else:
                send_response(client, 200, {"message": "Cartography already running"})

        elif method == "POST" and path == "/stopcartography":
            cartographCheck = False
            send_response(client, 200, {"message": "Cartography stopped", "map_points": map_points})

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

                send_response(client, 200, {"message": "Movement executed"})
            except (ValueError, KeyError):
                send_response(client, 400, {"error": "Invalid movement data"})

        elif method == "POST" and path == "/replay":
            if track:
                replay_track()
                send_response(client, 200, {"message": "Replay started"})
            else:
                send_response(client, 404, {"error": "No track available for replay"})

        elif method == "POST" and path == "/execute_map":
            try:
                data = ujson.loads(body)
                steps = data.get("map", [])
                if not isinstance(steps, list):
                    raise ValueError("Invalid map format")
                execute_stepsmap(steps)
                send_response(client, 200, {"message": "Map executed successfully"})
            except (ValueError, KeyError):
                send_response(client, 400, {"error": "Invalid map data"})

        elif method == "POST" and path == "/led":
            try:
                data = ujson.loads(body)
                r = int(data.get("R", 0))
                g = int(data.get("G", 0))
                b = int(data.get("B", 0))
                cyberpi.led.on(r, g, b)
                send_response(client, 200, {"message": "LED color set", "R": r, "G": g, "B": b})
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
