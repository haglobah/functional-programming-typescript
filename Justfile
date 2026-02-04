help:
    just --list

[parallel]
dev: frontend

frontend:
    bun dev

build:
    bun build

backend:
    bun backend.ts
