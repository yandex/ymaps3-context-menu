# ymaps3-context-menu package

---

Yandex JS API package

[![npm version](https://badge.fury.io/js/ymaps3-context-menu.svg)](https://badge.fury.io/js/ymaps3-context-menu)
[![npm](https://img.shields.io/npm/dm/ymaps3-context-menu.svg)](https://www.npmjs.com/package/ymaps3-context-menu)

## Props

The package is located in the `dist` folder:

- `dist/types` TypeScript types
- `dist/esm` es6 modules for direct connection in your project
- `dist/index.js` Yandex JS Module

Recommended use `YMapContextMenu` as usual npm package:

```sh
npm i ymaps3-context-menu
```

and dynamic import

```ts
main();
async function main() {
  await ymaps3.ready;
  const {YMapContextMenu, YMapContextMenuItem} = await import('ymaps3-context-menu');
  map = new YMap(document.getElementById('app'), {location: {bounds: [ [ 54.58311, 25.9985 ], [ 56.30248, 24.47889 ] ]}});

  map.addChild(new YMapDefaultSchemeLayer({}));
  map.addChild(new YMapDefaultFeaturesLayer({}));

  const contextMenu = new YMapContextMenu({
    visible: false,
    screenCoordinates: [ 0, 0 ]
  });
  contextMenu
    .addChild(
      new YMapContextMenuItem({
        text: 'Click',
        visible: true,
        onClick: () => {
          markerMenuItem.update({visible: false});
          contextMenu.update({visible: false});
          alert('click!')
        }
      })
    );
  map.addChild(contextMenu);

  const listener = new YMapListener({
    onContextMenu: (object, event) => {
      contextMenu.update({
        visible: true,
        screenCoordinates: event.screenCoordinates
      });
    },
    onActionStart: () => {
      contextMenu.update({visible: false});
    }
  });
  map.addChild(listener);
}
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

### YMapContextMenu props description

| Name              | Type             | Default      | Description                                              |
|:------------------|:-----------------|:-------------|:---------------------------------------------------------|
| visible           | boolean          |              | Shows or hides the context menu.                         |
| screenCoordinates | [number, number] |              | Screen coordinates where the context menu should appear. |
| width             | number           | 240          | Width of the context menu in pixels.                     |
| position          | Position         | bottom right | Position of the context menu relative to the pointer.    |

### YMapContextMenuItem props description

| Name         | Type                  | Default | Description                                                                        |
|:-------------|:----------------------|:--------|:-----------------------------------------------------------------------------------|
| visible      | boolean               |         | Shows or hides the context menu item.                                              |
| text         | string                |         | Text of the menu item.                                                             |
| icon         | string or HTMLElement |         | Reference to an icon or an HTML element with an icon for the menu item (optional). |
| iconPosition | 'start' or 'end'      | start   | Position of the icon.                                                              |
| onClick      | function              |         | Callback function to handle a click on the menu item.                              |
| disabled     | boolean               | false   | Flag indicating whether the menu item is disabled.                                 |
| order        | number                | 0       | Sets the order of the menu item in the list.                                       |
