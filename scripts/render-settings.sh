#!/bin/sh
set -eu

# Render runtime settings as JSON-encoded JavaScript values. Environment variables
# are read through awk's ENVIRON so no shell evaluation of their contents occurs.
awk '
BEGIN { print "\"use strict\";\n" }
/^window\.[A-Za-z0-9_]+ = "\$\{[A-Za-z0-9_]+\}";$/ {
    line = $0
    match(line, /^window\.[A-Za-z0-9_]+/)
    name = substr(line, 8, RLENGTH - 7)
    match(line, /\$\{[A-Za-z0-9_]+\}/)
    var = substr(line, RSTART + 2, RLENGTH - 3)
    value = ENVIRON[var]
    gsub(/\\/, "\\\\", value)
    gsub(/"/, "\\\"", value)
    gsub(/\r/, "", value)
    gsub(/\n/, "", value)
    printf "window.%s = \"%s\";\n", name, value
}
' /etc/nginx/settings.js.template > /etc/nginx/conf.d/settings.js
