import cyberpi  # CyberPi-Bibliothek für Joystick-Steuerung
#import serial   # Für die Kommunikation mit dem mBot
import time

# Verbindung mit dem mBot herstellen (anpassen, je nach Port)
#mbot_port = "COM11"  # Linux: /dev/ttyUSB0, Windows: COM3 o.ä.
#baudrate = 115200  # Standard-Baudrate für mBot
#mbot = serial.Serial(mbot_port, baudrate)

# Funktion, um mBot-Befehle zu senden
def send_command(left_speed, right_speed):
    """
    Sendet Befehle an den mBot-Motor.
    left_speed: Geschwindigkeit des linken Motors (-255 bis 255)
    right_speed: Geschwindigkeit des rechten Motors (-255 bis 255)
    """
    command = "M {left_speed} {right_speed}\n"  # Beispielbefehl
    #mbot.write(command.encode())  # Befehl senden

# Hauptprogramm
#try:
    print("Joystick-Steuerung starten. Bewege den Stick!")
    while True:
        # Joystick-Werte von CyberPi lesen
        x = cyberpi.controller.joystick('x')  # Horizontal (Werte von -100 bis 100)
        y = cyberpi.controller.joystick('y')  # Vertikal (Werte von -100 bis 100)

        # Geschwindigkeiten berechnen
        left_speed = int(y + x)  # Kombiniere y- und x-Achse für den linken Motor
        right_speed = int(y - x)  # Kombiniere y- und x-Achse für den rechten Motor

        # Werte anpassen, um innerhalb des mBot-Bereichs zu bleiben (-255 bis 255)
        left_speed = max(min(left_speed, 255), -255)
        right_speed = max(min(right_speed, 255), -255)

        # Befehle an mBot senden
        send_command(left_speed, right_speed)

        # Wartezeit für Stabilität
        time.sleep(0.1)

#except KeyboardInterrupt:
    #print("Programm beendet.")
    #send_command(0, 0)  # Motoren stoppen
    #mbot.close()
