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

Might be nice for educational purposes. Can be used in **both** front-end (HTML) and back-end (nodejs).

Called tinyelf because I've taken inspiration from <a href="https://github.com/tinygrad/tinygrad">tinygrad</a> to try to keep the code base minimal and maintainable. Written in Typescript.

---

## Quickstart

#### For Front-End using HTML

##### Usage

```html
<html>
  <head></head>
  <body>
    <script type="module">
      import { TinyELF } from "tinyelf.mjs";
      let x = new TinyELF();
    </script>
  </body>
</html>
```

#### For Back-End using nodejs

##### Install

```console
npm i tinyelf
```

##### Usage

```js
// import TinyELF module
const { TinyELF } = require("tinyelf");

// create a new instance of TinyELF
let elfParser = new TinyELF();
```

See <a href="./docs/examples.md">examples.md</a> for more examples.

## Features

## License

MIT
