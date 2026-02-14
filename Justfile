help:
    just --list

[parallel]
dev: frontend

frontend:
    bun dev

build:
    bun build

backend:
    bun auth.ts

open cmd="":
    #!/usr/bin/env bash
    url="http://localhost:5173"

    if [[ -n "{{ cmd }}" ]]; then
        {{ cmd }} "$url"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$url"
    elif command -v open &> /dev/null; then
        open "$url"
    else
        echo "No suitable cmd found. Please install xdg-open or open."
        exit 1
    fi
