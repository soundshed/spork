import bluetooth # pip install pybluez or pybluez-win10
import time
import traceback
from pynput import keyboard # pip install pynput

PI_ADDR = "00:00:00:00:00:00"  # set your Spork Audio 40 device address here
USB_BT_ADDR = ""
PORT = 2

# these are based on the wireshark captures when selecting presets via the app, 
# the correct commands probably involve reading state, then changing individual bytes before send to amp
cmdPreset1 = "01fe000053fe1a000000000000000000f00124000138000000f779"
cmdPreset2 = "01fe000053fe1a000000000000000000f00123010138000001f779"
cmdPreset3 = "01fe000053fe1a000000000000000000f00125020138000002f779"
cmdPreset4 = "01fe000053fe1a000000000000000000f00120030138000003f779"

serialSocket = None

def setup_bt_client(addr, port):
    client_sock = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
    client_sock.setblocking(True)
    timeout = 10
    while timeout > 0:
        try:
            client_sock.connect((addr, port))
            timeout = -1
        except bluetooth.btcommon.BluetoothError:
            time.sleep(1)
            timeout -= 1
            print("Waiting for connection...")
            continue

    if timeout == 0:
        print("Could not connect to server! PLZ try again and hope for better luck")
        return client_sock
    else:
        print("Successfully connected to ", addr)
        return client_sock


def main():
    restart = ""
    while not restart == "EXIT":
        restart = run()
        time.sleep(1)


def selectPreset(cmd):
    global serialSocket

    print("Changing preset..")

    msg = bytes.fromhex(cmd)
    serialSocket.send(msg)


def run():

    global serialSocket

    serialSocket = setup_bt_client(PI_ADDR, PORT)

    print("Press ESC to quit. Number keys to select preset.")

    # Collect events until released
    with keyboard.Listener(
            on_press=on_press,
            on_release=on_release) as listener:
        listener.join()


def on_press(key):
    try:
        print('alphanumeric key {0} pressed'.format(key.char))

        if (key.char == ('1')):
            selectPreset(cmdPreset1)

        if (key.char == '2'):
            selectPreset(cmdPreset2)

        if (key.char == '3'):
            selectPreset(cmdPreset3)

        if (key.char == '4'):
            selectPreset(cmdPreset4)
    except AttributeError:
        close_socket()
        print('special key {0} pressed'.format(key))
        exit()


def close_socket():
    global serialSocket
    serialSocket.close()


def on_release(key):

    global serialSocket

    if key == keyboard.Key.esc:
        serialSocket.close()

        # Stop listener
        return False

main()
