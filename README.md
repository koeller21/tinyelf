<div align="center">

<span style="font-size:5rem;">
elfbin.js
</span>

A tiny but mighty ELF binary parser written in JS/TS.

<h3>

[Live Demo]() | [Quickstart](#quickstart) | [Features](#features)

</h3>

</div>

---

- Can be used in <strong><ins>both</ins></strong> front-end (HTML) and back-end (node).
- An educational project, for any production-related front-end project, you should probably consider using back-end processing or webassembly.

---

## Quickstart

#### For Front-End using HTML

##### Usage

```html
<html>
  <head></head>
  <body>
    <script type="module">
      import { ElfBin } from "elfbin.mjs";
      let x = new ElfBin();
    </script>
  </body>
</html>
```

#### For Back-End using nodejs

##### Install

```console
npm i elfbin
```

##### Usage

```js
// import ElfBin module
const { ElfBin } = require("elfbin");

// create a new instance of ElfBin
let elfParser = new ElfBin();
```

See <a href="./docs/examples.md">examples.md</a> for more examples.

## Features

## License

MIT
