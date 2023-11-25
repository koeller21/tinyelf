<div align="center">

<img src="./docs/logo.png">
<br>
<br>
A tiny but mighty ELF binary parser written in JS/TS. 

<h3>

[Live Demo]() | [Quickstart](#quickstart) | [Features](#features)

</h3>


</div>

---

Might be nice for educational purposes. Tried to match <a href="">readelf</a> as closely as possible. See <a href="#features">features</a> for full feature list. 

Called tinyelf because I've taken inspiration from <a href="https://github.com/tinygrad/tinygrad">tinygrad</a> to try to keep the code base minimal and maintainable. Written in Typescript.

---

## Quickstart

#### Install

```console
npm i tinyelf
```

#### Usage

```js
// import TinyELF module
const {TinyELF} = require("tinyelf");

// create a new instance of TinyELF
let elfParser = new TinyELF();

```

## Features

## License

MIT
