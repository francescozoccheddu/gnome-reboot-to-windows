# Reboot to Windows

Gnome extension for Gnome 43.  
Adds an option to reboot into Windows in the quick settings poweroff menu.

Inspired by [Reboot to UEFI](https://github.com/UbayGD/reboottouefi). 
Thank you [UbayGD](https://github.com/UbayGD)!

## Setup

1. Clone this repository:
```shell
git clone https://github.com/francescozoccheddu/gnome-reboot-to-windows
cd gnome-reboot-to-windows
```
2. Build passing the bootloader entry as argument:
```shell
./build.sh "Windows 11"
```
3. Install the extension and restart Gnome:
```shell
./install.sh -r
```
4. Enjoy! 😉