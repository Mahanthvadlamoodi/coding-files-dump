import random
import pyautogui as pg
import time

arr=('emci','bisi','bsdk')
time.sleep(4)

for i in range(5):
    a=random.choice(arr)
    pg.write(a)
    pg.press('enter')