
import time
import traceback
import asyncio
from bleak import BleakScanner, BleakClient
from bleak.backends.characteristic import BleakGATTCharacteristic
from pynput import keyboard  # pip install pynput

def notification_handler(characteristic: BleakGATTCharacteristic, data: bytearray):
    """Simple notification handler which prints the data received."""
    print(f"{data.hex()}")


async def setup(name, address):
    async with BleakClient(address) as client:
        model_number = await client.read_gatt_char("00002a00-0000-1000-8000-00805f9b34fb")

        print("Device Name: {0}".format("".join(map(chr, model_number))))

        # changes GATT characteristic
        await client.start_notify("0000ffc2-0000-1000-8000-00805f9b34fb", notification_handler)
        print("listening..")

        # cmd= bytes.fromhex("01fe000053fe19000000000000000000f0013a1502100000f7") # get device channel selection

        for x in range(0, 4):
            print(f"Setting Preset {x}")
            cmd = bytes.fromhex(
                f"01fe000053fe1a000000000000000000f0013a15013800000{x}f7")  # set preset x
            # cmd
            await client.write_gatt_char("0000ffc1-0000-1000-8000-00805f9b34fb", cmd)

            await asyncio.sleep(2.0)

            print(f"Getting Preset {x}")
            cmd = bytes.fromhex(
                f"01fe000053fe1b000000000000000000f0013a1502010000000{x}f7")  # get preset x
            # cmd
            await client.write_gatt_char("0000ffc1-0000-1000-8000-00805f9b34fb", cmd)

            await asyncio.sleep(1.0)


async def main():

    # F7:EB:ED:1E:36:D4: Spark MINI BLE
    #await setup("Spark", "F7:EB:ED:1E:36:D4")

    devices = await BleakScanner.discover()
    for d in devices:
        print(d)
        if ("Spark" in str(d.name)):
            await setup(d.name,d.address)

asyncio.run(main())
