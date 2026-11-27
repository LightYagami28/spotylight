#!/bin/sh
# Genera settings.js dal template sostituendo ${VAR} con il valore della variabile
# d'ambiente, codificato come contenuto sicuro di una stringa JavaScript.
set -eu

template=/etc/spotylight/settings.js.template
output=/etc/nginx/conf.d/settings.js

awk '
BEGIN {
    bs = sprintf("%c", 92)
    nl = sprintf("%c", 10)
    cr = sprintf("%c", 13)
}
function escape_js(value,    result, i, c) {
    result = ""
    for (i = 1; i <= length(value); i++) {
        c = substr(value, i, 1)
        if (c == bs) result = result bs bs
        else if (c == "\"") result = result bs "\""
        else if (c == "<") result = result bs "u003c"
        else if (c == ">") result = result bs "u003e"
        else if (c == nl) result = result bs "n"
        else if (c == cr) result = result bs "r"
        else result = result c
    }
    return result
}
{
    line = $0
    out = ""
    while (match(line, /\$\{[A-Za-z0-9_]+\}/)) {
        name = substr(line, RSTART + 2, RLENGTH - 3)
        out = out substr(line, 1, RSTART - 1) escape_js(ENVIRON[name])
        line = substr(line, RSTART + RLENGTH)
    }
    print out line
}
' "$template" > "$output"
