# Functional Programming in TypeScript

This is an example repo for programming in a functional style in TypeScript.

It consists of one small audio player component, modeled in different intermediate states of 'functional-programmingness'.

## Getting started (Nix)

This project comes with a `flake.nix` that has everything you'll need.

To get up and running, [install Nix](https://beathagenlocher.com/nix/#install-nix) if you haven't already.

Then, enter the development shell:

```shell
nix develop
```

After that, there is a `Justfile` that has everything you need. Do a:

```shell
just setup
```

And then a:

``` shell
just open && just dev
```

This should run the vite dev server and open it in your browser.

After that, you can get started on reading/editing the code—the components are in `src/components/*`.

## Getting started (Manual)

To run this project, you need:

- [Bun](https://bun.com/docs/installation) installed
- [just](https://github.com/casey/just) (or you just read the Justfile and execute the commands from there) installed

And then:

``` shell
bun install
bun dev
# and then, open localhost:5173 in the browser
```
