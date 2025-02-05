import socket
import json

# Ziel-IP und Port
TARGET_IP = "10.10.1.28"  # IP-Adresse des mBot2
TARGET_PORT = 1235

def send_command(direction, speed, r=0, g=0, b=0):
    """
    Sendet einen Steuerungsbefehl an den mBot.
    """
    # Befehl erstellen
    command = {
        "direction": direction,
        "speed": speed,
        "R": r,
        "G": g,
        "B": b
    }

    # Socket erstellen und Daten senden
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.sendto(json.dumps(command).encode("utf-8"), (TARGET_IP, TARGET_PORT))
            print(f"Befehl gesendet: {command}")
    except Exception as e:
        print(f"Fehler beim Senden des Befehls: {e}")

def main():
    valid_directions = ["forward", "backward", "left", "right", "stop"]
    print("mBot Steuerung mit Joystick gestartet.")
    print("Drücke Strg+C, um das Programm zu beenden.\n")

    try:
        while True:
            print("Optionen: forward, backward, left, right, stop")
            direction = input("Richtung eingeben: ").lower()

            # Überprüfen, ob die Richtung gültig ist
            if direction not in valid_directions:
                print("Ungültige Richtung! Bitte wähle eine der folgenden: forward, backward, left, right, stop.")
                continue

            # Geschwindigkeit abfragen und validieren
            try:
                speed = int(input("Geschwindigkeit (0-100): "))
                if not (0 <= speed <= 100):
                    print("Bitte eine Geschwindigkeit zwischen 0 und 100 eingeben.")
                    continue
            except ValueError:
                print("Ungültige Eingabe! Geschwindigkeit muss eine Zahl sein.")
                continue

            # Befehl senden
            send_command(direction, speed, r=0, g=255, b=0)
    except KeyboardInterrupt:
        print("\nProgramm beendet. Auf Wiedersehen!")

if __name__ == "__main__":
    main()
