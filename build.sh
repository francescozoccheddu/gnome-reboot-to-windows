#!/bin/bash

log() { echo "$@" 1>&2; }
err() { log "$@" && exit 1; }

COMMAND=$(<reboot-command.txt)

[ $(wc -l <<< "$COMMAND") = "1" ] || err "reboot-command.txt can only contain a single line"
[[ "$COMMAND" =~ ^[a-zA-Z0-9_/-]*$ ]] || err "reboot-command.txt can only contain alphanumeric characters, forward slashes, underscores and hyphens"

rm -rf .build/
mkdir .build/

cp src/extension.js .build/
cp src/metadata.json .build/

cd .build

sed -i -e "s|%COMMAND%|$COMMAND|g" extension.js

gnome-extensions pack --out-dir=../ --force

cd ..

rm -r .build/

log "successfully built with hardcoded command '$COMMAND'"
[ "$COMMAND" == "reboot-to-windows" ] && log "edit reboot-command.txt to change it"