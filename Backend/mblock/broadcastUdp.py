import cyberpi
import time
import usocket

cyberpi.led.on(0, 0,255) #Lights up all the LEDs

cyberpi.wifi.connect("htljoh-public", "joh12345")

if cyberpi.wifi.is_connect():
    cyberpi.console.println("WLAN verbunden!")
else:
    cyberpi.console.println("Verbindung fehlgeschlagen.")

while True:
    b = cyberpi.wifi.is_connect()
    if b == False:
        cyberpi.led.on(255,0, 0)
        time.sleep(1)
    else:
        cyberpi.led.on(0,255, 0)
        break


s = usocket.socket(usocket.AF_INET, usocket.SOCK_DGRAM)

s.bind (("10.10.2.217", 1235))
i =1

name = "SUPERPI"
while True:
    s.sendto(name, ("10.10.2.217", 1238))
    i += 1
    time.sleep(1)
    cyberpi.led.on(255,255, 255)
    time.sleep(0.1)
    cyberpi.led.on(0,0, 0)
    b, adr = s.recvfrom(1024)
    cyberpi.console.println(str(b, "utf-8"))
    cyberpi.console.println(str(adr))
    cyberpi.led.on(255,255, 255)
