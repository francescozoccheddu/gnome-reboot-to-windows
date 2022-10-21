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
2. Set your reboot command in `reboot-command.txt`:
```shell
echo "my-reboot-command" > reboot-command.txt
```
3. Build and install the extension:
```shell
./build.sh
./install.sh
```
4. Restart gnome:
```shell
killall -3 gnome-shell
```
5. Enjoy! 😉