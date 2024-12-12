import type {LngLat} from '@yandex/ymaps3-types';
import {LOCATION, MARKER_LOCATION} from '../common';
window.map = null;

main();
async function main() {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapListener} = ymaps3;

    const {YMapContextMenu, YMapContextMenuItem} = await ymaps3.import('ymaps3-context-menu');
    const {YMapDefaultMarker} = await ymaps3.import('@yandex/ymaps3-default-ui-theme');

    let zoom = 13;
    let contextMenuLngLat: LngLat = null;
    map = new YMap(document.getElementById('app'), {location: LOCATION});

    map.addChild(new YMapDefaultSchemeLayer({}));
    map.addChild(new YMapDefaultFeaturesLayer({}));

    const contextMenu = new YMapContextMenu({
        visible: false,
        screenCoordinates: [0, 0]
    });
    contextMenu
        .addChild(
            new YMapContextMenuItem({
                text: 'Zoom in',
                visible: true,
                onClick: () => {
                    map.update({location: {zoom: zoom + 1, duration: 2000, easing: 'ease-in-out'}});
                    markerMenuItem.update({visible: false});
                    contextMenu.update({
                        visible: false
                    });
                }
            })
        )
        .addChild(
            new YMapContextMenuItem({
                text: 'Zoom out',
                visible: true,
                onClick: () => {
                    map.update({location: {zoom: zoom - 1, duration: 2000, easing: 'ease-in-out'}});
                    markerMenuItem.update({visible: false});
                    contextMenu.update({
                        visible: false
                    });
                }
            })
        )
        .addChild(
            new YMapContextMenuItem({
                text: 'Center by it',
                visible: true,
                onClick: () => {
                    map.setLocation({center: contextMenuLngLat, duration: 2000, easing: 'ease-in-out'});
                    markerMenuItem.update({visible: false});
                    contextMenu.update({
                        visible: false
                    });
                }
            })
        );

    const markerMenuItem = new YMapContextMenuItem({
        text: 'Пункт для маркера',
        visible: false,
        order: 1,
        onClick: () => {
            contextMenu.update({visible: false});
            markerMenuItem.update({visible: false});
            alert('click on marker!');
        }
    });
    contextMenu.addChild(markerMenuItem);

    map.addChild(contextMenu);

    map.addChild(
        new YMapDefaultMarker({
            coordinates: MARKER_LOCATION,
            iconName: 'fallback',
            size: 'normal'
        })
    );

    const listener = new YMapListener({
        onContextMenu: (object, event) => {
            if (object && object.entity instanceof ymaps3.YMapMarker) {
                markerMenuItem.update({visible: true});
            } else {
                markerMenuItem.update({visible: false});
            }

            contextMenuLngLat = event.coordinates;
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
