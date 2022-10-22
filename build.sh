#!/bin/bash

log() { echo "$@" 1>&2; }
die() { exit 1; }
usg() { log "usage:"; log "$0 <COMMAND>"; log "(where COMMAND is the bootloader entry name for Windows)"; }

[ "$#" -ne 1 ] && log "expected a single argument, got $#" && usg && die

[ $(wc -l <<< "$1") -ne 1 ] && log "reboot command cannot contain multiple lines" && die
[[ "$1" =~ [^a-zA-Z0-9_/-] ]] && log "reboot command can only contain alphanumeric characters, forward slashes, underscores and hyphens" && die

rm -rf .build/
mkdir .build/

cp src/extension.js .build/
cp src/metadata.json .build/

cd .build

sed -i -e "s|%COMMAND%|$1|g" extension.js

gnome-extensions pack --out-dir=../ --force

cd ..

rm -r .build/

log "successfully built with hardcoded reboot command '$1'"
