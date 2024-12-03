# ymaps3-context-menu package

---

Yandex JS API package

[![npm version](https://badge.fury.io/js/ymaps3-context-menu.svg)](https://badge.fury.io/js/ymaps3-context-menu)
[![npm](https://img.shields.io/npm/dm/ymaps3-context-menu.svg)](https://www.npmjs.com/package/ymaps3-context-menu)

## How use

The package is located in the `dist` folder:

- `dist/types` TypeScript types
- `dist/esm` es6 modules for direct connection in your project
- `dist/index.js` Yandex JS Module

Recommended use `YMapButtonExample` as usual npm package:

```sh
npm i ymaps3-context-menu
```

and dynamic import

```js
await ymaps3.ready;

// ...

const {YMapButtonExample} = await import('ymaps3-context-menu');

// ...

map.addChild(new YMapButtonExample(props));
```

### Usage without npm

You can use CDN with module loading handler in JS API on your page.

Just use `ymaps3.import`:

```js
const pkg = await ymaps3.import('ymaps3-context-menu');
```

By default `ymaps3.import` can load self modules.
If you want also load your package, should register cdn:

```js
ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', 'ymaps3-context-menu@latest');
```
