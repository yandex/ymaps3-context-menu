import type {LngLat, LngLatBounds, YMapLocationRequest} from '@yandex/ymaps3-types';

ymaps3.import.loaders.unshift(async (pkg) => {
    if (!pkg.startsWith('ymaps3-context-menu')) {
        return;
    }

    if (location.href.includes('localhost')) {
        await ymaps3.import.script(`/dist/index.js`);
    } else {
        await ymaps3.import.script(`https://unpkg.com/${pkg}/dist/index.js`);
    }

    return window['ymaps3-context-menu'];
});

ymaps3.ready.then(() => {
    ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', '@yandex/ymaps3-default-ui-theme@0.0');
});

const BOUNDS: LngLatBounds = [
    [54.58311, 25.9985],
    [56.30248, 24.47889]
];

export const MARKER_LOCATION: LngLat = [55.4785, 25.4027];
export const LOCATION: YMapLocationRequest = {bounds: BOUNDS};
