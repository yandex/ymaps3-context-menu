import type {BehaviorMapEventHandler, DomEventHandler, LngLat, YMapZoomLocation} from '@yandex/ymaps3-types';
import {LOCATION, MARKER_LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3React] = await Promise.all([ymaps3.import('@yandex/ymaps3-reactify'), ymaps3.ready]);
    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapListener} = reactify.module(ymaps3);

    const {useState} = React;

    const {YMapContextMenu, YMapContextMenuItem} = reactify.module(await ymaps3.import('ymaps3-context-menu'));
    const {YMapDefaultMarker} = reactify.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    const App = () => {
        const [location, setLocation] = useState(LOCATION);
        const [visibleContextMenu, setVisibleContextMenu] = useState(false);
        const [visibleMarkerItem, setVisibleMarkerItem] = useState(false);
        const [screenCoordinates, setScreenCoordinates] = useState<[number, number]>();
        const [contextMenuLngLat, setContextMenuLngLat] = useState<LngLat>();

        const onContextMenu: DomEventHandler = (object, event) => {
            if (object && object.type === 'marker') {
                setVisibleMarkerItem(true);
            } else {
                setVisibleMarkerItem(false);
            }

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

        const clickOnMarker = () => {
            setVisibleContextMenu(false);
            alert('click on marker!');
        };

        return (
            <YMap location={location}>
                <YMapDefaultSchemeLayer />

                <YMapDefaultFeaturesLayer />

                <YMapContextMenu visible={visibleContextMenu} screenCoordinates={screenCoordinates}>
                    <YMapContextMenuItem text="Zoom in" visible={true} onClick={zoomIn} />
                    <YMapContextMenuItem text="Zoom out" visible={true} onClick={zoomOut} />
                    <YMapContextMenuItem text="Center by it" visible={true} onClick={centerByIt} />
                    <YMapContextMenuItem
                        text="Marker item"
                        visible={visibleMarkerItem}
                        order={1}
                        onClick={clickOnMarker}
                    />
                </YMapContextMenu>

                <YMapDefaultMarker iconName="fallback" size="normal" coordinates={MARKER_LOCATION} />

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
