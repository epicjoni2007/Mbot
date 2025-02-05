import event, time, cyberpi, mbot2
import time

@event.start
def on_start():
    cyberpi.console.clear()
    cyberpi.console.set_font(12)
    cyberpi.console.println("Welcome to mBot2")

@event.is_press('up')
def is_joy_press():
    time.sleep(0)
    #cyberpi.audio.play('hi')
    cyberpi.console.println("move forward 10cm")
    cyberpi.led.on(0, 255, 43, "all")
    mbot2.straight(20)

@event.is_press('down')
def is_joy_press1():
    time.sleep(0)
    #cyberpi.audio.play('sad')
    cyberpi.console.println("move backward 10cm")
    cyberpi.led.on(255, 0, 29, "all")
    mbot2.straight(-10)

@event.is_press('right')
def is_joy_press2():
    time.sleep(0)
    #cyberpi.audio.play('hum')
    cyberpi.console.println("turn right 90°")
    cyberpi.led.show('black black blue blue blue')
    mbot2.turn(90)

@event.is_press('left')
def is_joy_press3():
    time.sleep(0)
    #cyberpi.audio.play('hum')
    cyberpi.console.println("turn left 90°")
    cyberpi.led.show('blue blue blue black black')
    mbot2.turn(-90)