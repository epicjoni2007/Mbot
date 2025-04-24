import event, time, cyberpi, mbot2, mbuild
# initialize variables
count = 0
 
@event.is_press('b')
def is_btn_press():
    global count
    count = 1
    while True:
      mbot2.forward(50)
      cyberpi.console.println(count)
      if mbuild.ultrasonic2.get(1) < 15 and count == 1:
        mbot2.straight(5)
        mbot2.turn(90)
        mbot2.straight(15)
        mbot2.turn(-90)
        cyberpi.console.println(count)
        if mbuild.ultrasonic2.get(1) < 15:
          mbot2.turn(180)
          count = 0
          cyberpi.console.println(count)
 
      if mbuild.ultrasonic2.get(1) < 15 and count == 0:
        mbot2.straight(5)
        mbot2.turn(-90)
        mbot2.straight(15)
        mbot2.turn(90)
        cyberpi.console.println(count)
        if mbuild.ultrasonic2.get(1) < 15:
          mbot2.turn(-180)
          count = 1
          cyberpi.console.println(count)
 
@event.is_press('a')
def is_btn_press1():
    global count
    cyberpi.stop_all()