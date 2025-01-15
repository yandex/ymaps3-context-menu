import type {LngLatBounds, YMap, YMapComplexEntity, YMapGroupEntity} from '@yandex/ymaps3-types';
import {YMapContextMenu} from './YMapContextMenu';
import {YMapContextMenuItem} from './YMapContextMenuItem';

describe('YMap smoke test', () => {
    const BOUNDS: LngLatBounds = [
        [54.58311, 25.9985],
        [56.30248, 24.47889]
    ];

    const LOCATION = {bounds: BOUNDS};

    let container: HTMLElement, map: YMap, contextMenu: YMapGroupEntity<{}>, contextMenuItem: YMapComplexEntity<{}>;
    beforeEach(() => {
        container = document.createElement('div');
        Object.assign(container.style, {width: `643px`, height: `856px`});
        document.body.appendChild(container);
        contextMenu = new YMapContextMenu({
            visible: false,
            screenCoordinates: [200, 200]
        });
        contextMenuItem = new YMapContextMenuItem({
            text: 'Center by it',
            visible: true,
            onClick: () => {
                contextMenuItem.update({visible: false});
            }
        });
        contextMenu.addChild(contextMenuItem);
        map = new ymaps3.YMap(container, {location: LOCATION}, [contextMenu]);
    });

    afterEach(() => {
        map.destroy();
        container.remove();
        contextMenu.removeChild(contextMenuItem);
    });

    it('should make map', () => {
        const tree = domToJson(map.container);
        expect(tree).toMatchSnapshot();
    });

    it('should make context menu visible', () => {
        contextMenu.update({visible: true});
        const block = document.querySelector('.ymaps3--context-menu_visible');
        expect(block).not.toBeNull();
    });

    it('should make context menu invisible', () => {
        contextMenu.update({visible: false});
        const block = document.querySelector('.ymaps3--context-menu_visible');
        expect(block).toBeNull();
    });

    it('should make context item menu visible', () => {
        const block = document.querySelector('.ymaps3--context-menu-item_visible');
        expect(block).not.toBeNull();
    });

    it('should make context item menu invisible', () => {
        contextMenuItem.update({visible: false});
        const block = document.querySelector('.ymaps3--context-menu-item_visible');
        expect(block).toBeNull();
    });

    it('should change context menu coordinates', () => {
        const block = document.querySelector('.ymaps3--context-menu');
        const blockStyle = window.getComputedStyle(block);

        expect(blockStyle.left).not.toEqual(0);
        expect(blockStyle.top).not.toEqual(0);
    });
});
