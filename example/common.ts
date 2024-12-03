import type {YMapLocationRequest, LngLatBounds} from '@yandex/ymaps3-types';

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

const BOUNDS: LngLatBounds = [
    [54.58311, 25.9985],
    [56.30248, 24.47889]
];

export const LOCATION: YMapLocationRequest = {bounds: BOUNDS};
