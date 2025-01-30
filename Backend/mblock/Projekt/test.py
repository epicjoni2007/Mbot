#IMPORTS--------------------------------------- 
import cyberpi as cpi 
import time 
 
#WAIT TO START--------------------------------- 
cpi.console.println('Press A') 
while not cpi.controller.is_press('a'): 
    cpi.led.on(255,0,0) 
cpi.led.on(0,255,0) 
 
#MAIN LOOP------------------------------------- 
while True: 
    cpi.mbot2.forward(speed = 60, run_time = 3)    #Example commands.  
    cpi.mbot2.backward(speed = 50, run_time = 2)   #Replace with your own! 