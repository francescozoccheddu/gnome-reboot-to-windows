#!/bin/bash

log() { echo "$@" 1>&2; }
die() { exit 1; }
usg() { log "usage:"; log "$0 [-r]"; log "(where -r restarts gnome)"; }

[ "$#" -gt 1 ] && log "expected 0 or 1 arguments, got $#" && usg && die
[ "$#" -eq 1 ] && [ "$1" != "-r" ] && log "expected '-r' argument, got '$1'" && usg && die

gnome-extensions install "reboot-to-windows@francescozoccheddu.com.shell-extension.zip" --force && log "successfully installed" || die

[ "$#" -eq 1 ] && killall -3 gnome-shell && log "sucessfully killed gnome"