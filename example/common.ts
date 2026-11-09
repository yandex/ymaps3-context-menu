import type {LngLat, YMapLocationRequest} from '@yandex/ymaps3-types';

ymaps3.import.loaders.unshift(async (pkg) => {
    if (!pkg.startsWith('@yandex/ymaps3-context-menu')) {
        return;
    }

    if (location.href.includes('localhost')) {
        await ymaps3.import.script(`/dist/index.js`);
    } else {
        await ymaps3.import.script(`https://unpkg.com/${pkg}/dist/index.js`);
    }

    return window['@yandex/ymaps3-context-menu'];
});

ymaps3.ready.then(() => {
    ymaps3.import.registerCdn('https://cdn.jsdelivr.net/npm/{package}', '@yandex/ymaps3-default-ui-theme@0.0');
});

export const MARKER_LOCATION: LngLat = [158.746, 53.0238];
export const LOCATION: YMapLocationRequest = {
    center: [37.629, 55.7521],
    zoom: 13
};
