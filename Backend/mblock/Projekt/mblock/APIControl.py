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

 
# Hilfsfunktionen
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

def handle_request(client):
    try:
        request = client.recv(1024).decode("utf-8")
        cyberpi.console.println(request)
 
        method, path, body = parse_request(request)
 
        if method == "GET" and path == "/status":
            status = {"connected": cyberpi.network.is_connect()}
            send_response(client, 200, status)
 
        elif method == "POST" and path == "/led":
            try:
                data = ujson.loads(body)
                cyberpi.led.on(data.get('R', 0), data.get('G', 0), data.get('B', 0))
                send_response(client, 200, {"message": "LED updated"})
            except (ValueError, KeyError):
                send_response(client, 400, {"error": "Invalid JSON data"})
 
        elif method == "POST" and path == "/move":
            try:
                data = ujson.loads(body)
                direction = data.get('direction', 'stop')
                speed = data.get('speed', 0)
    
                if direction == "forward":
                    distance = cyberpi.ultrasonic2.get(index=1) 
                    pot = cyberpi.slider.get()
                    light = cyberpi.get_bri() 
                    cyberpi.console.println(light)
                    time.sleep(10)
                    mbot2.forward(speed)
                elif direction == "backward":
                    mbot2.backward(speed)
                elif direction == "left":
                    mbot2.turn_left(speed)
                elif direction == "right":
                    mbot2.turn_right(speed)
                elif direction == "stop":
                    cyberpi.mbot2.drive_power(0, 0)
                else:
                    raise ValueError("Unknown direction")
 
                send_response(client, 200, {"message": "Movement executed"})
                cyberpi.console.println(cyberpi.led.get()) 
            except (ValueError, KeyError):
                send_response(client, 400, {"error": "Invalid movement data"})
 
        else:
            send_response(client, 404, {"error": "Not found"})
 
    except Exception as e:
        send_response(client, 500, {"error": "Server error: {str(e)}"})
 
# Server-Loop
while True:
    try:
        client, addr = s.accept()
        cyberpi.console.println(addr)
        handle_request(client)
    except Exception as e:
        cyberpi.console.println("Fehler: {e}")
    finally:
        client.close()