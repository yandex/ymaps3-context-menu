import type {BehaviorMapEventHandler, DomEventHandler, LngLat} from '@yandex/ymaps3-types';
import {LOCATION, MARKER_LOCATION} from '../common';

window.map = null;

main();
async function main() {
    const [ymaps3Vue] = await Promise.all([ymaps3.import('@yandex/ymaps3-vuefy'), ymaps3.ready]);
    const vuefy = ymaps3Vue.vuefy.bindTo(Vue);

    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapListener} = vuefy.module(ymaps3);

    const {YMapContextMenu, YMapContextMenuItem} = vuefy.module(await ymaps3.import('@yandex/ymaps3-context-menu'));
    const {YMapDefaultMarker} = vuefy.module(await ymaps3.import('@yandex/ymaps3-default-ui-theme'));

    const app = Vue.createApp({
        components: {
            YMap,
            YMapDefaultSchemeLayer,
            YMapDefaultFeaturesLayer,
            YMapListener,
            YMapContextMenu,
            YMapContextMenuItem,
            YMapDefaultMarker
        },
        setup() {
            const refMap = (ref) => {
                window.map = ref?.entity;
            };
            const location = Vue.ref(LOCATION);
            const visibleContextMenu = Vue.ref(false);
            const visibleMarkerItem = Vue.ref(false);
            const screenCoordinates = Vue.ref<[number, number]>();
            const contextMenuLngLat = Vue.ref<LngLat>();

            const onContextMenu: DomEventHandler = (object, event) => {
                if (object && object.entity instanceof ymaps3.YMapMarker) {
                    visibleMarkerItem.value = true;
                } else {
                    visibleMarkerItem.value = false;
                }

                contextMenuLngLat.value = event.coordinates;
                visibleContextMenu.value = true;
                screenCoordinates.value = event.screenCoordinates;
            };

            const onActionStart: BehaviorMapEventHandler = () => {
                visibleContextMenu.value = false;
            };

            const zoomIn = () => {
                location.value = {
                    zoom: map.zoom + 1,
                    duration: 400,
                    easing: 'ease-in-out'
                };
                visibleContextMenu.value = false;
            };

            const zoomOut = () => {
                location.value = {
                    zoom: map.zoom - 1,
                    duration: 600,
                    easing: 'ease-in-out'
                };
                visibleContextMenu.value = false;
            };

            const centerByIt = () => {
                location.value = {center: contextMenuLngLat.value, duration: 500, easing: 'ease-in-out'};
                visibleContextMenu.value = false;
            };

            const clickOnMarker = () => {
                visibleContextMenu.value = false;
                alert('click on marker!');
            };

            return {
                location,
                visibleContextMenu,
                refMap,
                visibleMarkerItem,
                screenCoordinates,
                contextMenuLngLat,
                clickOnMarker,
                centerByIt,
                zoomOut,
                zoomIn,
                onActionStart,
                onContextMenu,
                MARKER_LOCATION
            };
        },
        template: `
            <YMap :location="location" :ref="refMap">
                <YMapDefaultSchemeLayer />

                <YMapDefaultFeaturesLayer />

                <YMapContextMenu :visible="visibleContextMenu" :screenCoordinates="screenCoordinates">
                    <YMapContextMenuItem icon="../zoomInIcon.svg" text="Zoom in" :visible="true" :onClick="zoomIn" />
                    <YMapContextMenuItem icon="../zoomOutIcon.svg" text="Zoom out" :visible="true" :onClick="zoomOut" />
                    <YMapContextMenuItem text="Center by it" :visible="true" :onClick="centerByIt" />
                    <YMapContextMenuItem
                        icon="../centerByItIcon.svg"
                        text="Marker item"
                        :visible="visibleMarkerItem"
                        :order="1"
                        :onClick="clickOnMarker"
                    />
                </YMapContextMenu>

                <YMapDefaultMarker :coordinates="MARKER_LOCATION" iconName="fallback" size="normal" />

                <YMapListener :onContextMenu="onContextMenu" :onActionStart="onActionStart" />
            </YMap>`
    });
    app.mount('#app');
}
