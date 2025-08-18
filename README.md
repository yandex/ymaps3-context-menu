# ymaps3-context-menu package

---

Yandex JS API package

[![npm version](https://badge.fury.io/js/@yandex%2Fymaps3-context-menu.svg)](https://badge.fury.io/js/@yandex%2Fymaps3-context-menu)
[![npm](https://img.shields.io/npm/dm/%40yandex%2Fymaps3-context-menu)](https://www.npmjs.com/package/@yandex/ymaps3-context-menu)

## Props

The package is located in the `dist` folder:

- `dist/types` TypeScript types
- `dist/esm` es6 modules for direct connection in your project
- `dist/index.js` Yandex JS Module

Recommended use `ymaps3-context-menu` as usual npm package:

```sh
npm install @yandex/ymaps3-context-menu
```

You also need to import css styles into your project:

```css
/* index.css */
@import '@yandex/ymaps3-context-menu/dist/esm/index.css';
```

and dynamic import

```ts
main();
async function main() {
  await ymaps3.ready;
  const {YMapContextMenu, YMapContextMenuItem} = await import('@yandex/ymaps3-context-menu');
  map = new ymaps3.YMap(document.getElementById('app'), {location: LOCATION});

  map.addChild(new ymaps3.YMapDefaultSchemeLayer({}));
  map.addChild(new ymaps3.YMapDefaultFeaturesLayer({}));

  const contextMenu = new YMapContextMenu({
    visible: false,
    screenCoordinates: [0, 0]
  });
  contextMenu.addChild(
    new YMapContextMenuItem({
      text: 'Click',
      visible: true,
      onClick: () => {
        contextMenu.update({visible: false});
      }
    })
  );
  map.addChild(contextMenu);

  const listener = new ymaps3.YMapListener({
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

```tsx
main();
async function main() {
  const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
  const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

  const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapListener} = reactify.module(ymaps3);

  const {useState} = React;

  const {YMapContextMenu, YMapContextMenuItem} = reactify.module(await import('@yandex/ymaps3-context-menu'));

  const App = () => {
    const [location, setLocation] = useState(LOCATION);
    const [visibleContextMenu, setVisibleContextMenu] = useState(false);
    const [screenCoordinates, setScreenCoordinates] = useState<[number, number]>();
    const [contextMenuLngLat, setContextMenuLngLat] = useState<LngLat>();

    const onContextMenu: DomEventHandler = (object, event) => {
      setContextMenuLngLat(event.coordinates);
      setVisibleContextMenu(true);
      setScreenCoordinates(event.screenCoordinates);
    };

    const onActionStart: BehaviorMapEventHandler = () => {
      setVisibleContextMenu(false);
    };

    const zoomIn = () => {
      setLocation({zoom: (location as YMapZoomLocation).zoom + 1, duration: 600, easing: 'ease-in-out'});
      setVisibleContextMenu(false);
    };

    const zoomOut = () => {
      setLocation({zoom: (location as YMapZoomLocation).zoom - 1, duration: 400, easing: 'ease-in-out'});
      setVisibleContextMenu(false);
    };

    const centerByIt = () => {
      setLocation({center: contextMenuLngLat, duration: 500, easing: 'ease-in-out'});
      setVisibleContextMenu(false);
    };

    return (
      <YMap location={location}>
        <YMapDefaultSchemeLayer />

        <YMapDefaultFeaturesLayer />

        <YMapContextMenu visible={visibleContextMenu} screenCoordinates={screenCoordinates}>
          <YMapContextMenuItem text="Zoom in" visible={true} onClick={zoomIn} />
          <YMapContextMenuItem text="Zoom out" visible={true} onClick={zoomOut} />
          <YMapContextMenuItem text="Center by it" visible={true} onClick={centerByIt} />
        </YMapContextMenu>

        <YMapListener onContextMenu={onContextMenu} onActionStart={onActionStart} />
      </YMap>
    );
  };

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app')
  );
}
```

### Usage without npm

You can use CDN with module loading handler in JS API on your page.

By default `ymaps3.import` can load self modules.
If you want also load your package, should register cdn:

```js
ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', '@yandex/ymaps3-context-menu@latest');
```

Just use `ymaps3.import`:

```js
const {YMapContextMenu, YMapContextMenuItem} = await ymaps3.import('@yandex/ymaps3-context-menu');
```

### YMapContextMenu props description

| Name              | Type             | Default      | Description                                              |
| :---------------- | :--------------- | :----------- | :------------------------------------------------------- |
| visible           | boolean          |              | Shows or hides the context menu.                         |
| screenCoordinates | [number, number] |              | Screen coordinates where the context menu should appear. |
| width             | number           | 240          | Width of the context menu in pixels.                     |
| position          | Position         | bottom right | Position of the context menu relative to the pointer.    |

### YMapContextMenuItem props description

| Name         | Type                  | Default | Description                                                                        |
| :----------- | :-------------------- | :------ | :--------------------------------------------------------------------------------- |
| visible      | boolean               |         | Shows or hides the context menu item.                                              |
| text         | string                |         | Text of the menu item.                                                             |
| icon         | string or HTMLElement |         | Reference to an icon or an HTML element with an icon for the menu item (optional). |
| iconPosition | 'start' or 'end'      | start   | Position of the icon.                                                              |
| onClick      | function              |         | Callback function to handle a click on the menu item.                              |
| disabled     | boolean               | false   | Flag indicating whether the menu item is disabled.                                 |
| order        | number                | 0       | Sets the order of the menu item in the list.                                       |
