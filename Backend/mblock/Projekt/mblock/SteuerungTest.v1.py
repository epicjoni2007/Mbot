import event, time, cyberpi, mbot2
import time

@event.start
def on_start():
    cyberpi.console.clear()
    cyberpi.console.set_font(12)
    cyberpi.console.println("Welcome to mBot2")
    
    
@cyberpi.event.mesh_broadcast("forward")
def on_mesh_broadcast():
    mbot2.forward(50)
    cyberpi.console.println("move forward")
    cyberpi.led.on(0, 255, 43, "all")

@cyberpi.event.mesh_broadcast("backward")
def on_mesh_broadcast1():
    mbot2.backward(10)
    time.sleep(0.1)
    cyberpi.console.println("move backward")
    cyberpi.led.on(255, 0, 29, "all")
    mbot2.backward(30)

@cyberpi.event.mesh_broadcast("right")
def on_mesh_broadcast2():
    mbot2.straight(0)
    cyberpi.console.println("turn right 90 deges")
    cyberpi.led.show('black black blue blue blue')
    mbot2.turn_right(15, 15)

@cyberpi.event.mesh_broadcast("left")
def on_mesh_broadcast3():
    mbot2.straight(0)
    cyberpi.console.println("turn left 90°")
    cyberpi.led.show('blue blue blue black black')
    mbot2.turn_left(15, 15)
    
@cyberpi.event.mesh_broadcast("stop")
def on_mesh_broadcast4():
    cyberpi.console.println("stop")
    cyberpi.led.show('blue blue blue black black')
    mbot2.straight(0)
   
        

