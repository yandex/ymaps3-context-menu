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
})


const BOUNDS = [
    [36.76340182421873, 56.50491493486398],
    [38.48276217578123, 54.98530386445313]
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LOCATION = {bounds: BOUNDS};
