import event, time, cyberpi, mbot2, mbuild

# Initialisierung der Variablen
count = 0
room_map = []  # Liste zur Speicherung der Karte
robot_position = [0, 0]  # Startposition
robot_direction = 0  # 0 = Norden, 90 = Osten, 180 = Süden, 270 = Westen

# Funktion zur Speicherung der Umgebung
def update_map(position, value):
    if position not in room_map:
        room_map.append((position[0], position[1], value))

@event.is_press('b')
def start_mapping():
    global count, robot_position, robot_direction
    count = 1
    while True:
        mbot2.forward(50)
        time.sleep(0.5)  # kurze Verzögerung
        robot_position[0] += 1 if robot_direction == 90 else -1 if robot_direction == 270 else 0
        robot_position[1] += 1 if robot_direction == 0 else -1 if robot_direction == 180 else 0
        update_map(tuple(robot_position), "free")
        
        if mbuild.ultrasonic2.get(1) < 15:
            update_map(tuple(robot_position), "wall")
           
            if count == 1:
                mbot2.turn(90)
                robot_direction = (robot_direction + 90) % 360
                mbot2.straight(15)
                mbot2.turn(-90)
                robot_direction = (robot_direction - 90) % 360
                if mbuild.ultrasonic2.get(1) < 15:
                    mbot2.turn(180)
                    robot_direction = (robot_direction + 180) % 360
                    count = 0
            else:
                mbot2.turn(-90)
                robot_direction = (robot_direction - 90) % 360
                mbot2.straight(15)
                mbot2.turn(90)
                robot_direction = (robot_direction + 90) % 360
                if mbuild.ultrasonic2.get(1) < 15:
                    mbot2.turn(-180)
                    robot_direction = (robot_direction - 180) % 360
                    count = 1
        cyberpi.console.println(room_map)

@event.is_press('a')
def stop_mapping():
    global count
    cyberpi.stop_all()
    cyberpi.console.println("Kartographierung gestoppt")
    cyberpi.console.println("Karte: ", room_map)
