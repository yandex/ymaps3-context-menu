import {LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapControls} = ymaps3;

    const {YMapButtonExample} = await ymaps3.import('ymaps3-context-menu');

    map = new YMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(new YMapDefaultFeaturesLayer({}));

    map.addChild(
        new YMapControls({position: 'right'})
            .addChild(new YMapButtonExample({text: 'My button', onClick: () => alert('Click!')}))
    );
}
