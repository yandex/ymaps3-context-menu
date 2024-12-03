import type {LngLatBounds} from '@yandex/ymaps3-types/common/types';
import {YMap} from '@yandex/ymaps3-types';
import {YMapButtonExample} from './YMapButtonExample';

describe('YMap smoke test', () => {
    const BOUNDS: LngLatBounds = [
        [54.58311, 25.9985],
        [56.30248, 24.47889]
    ];

    const LOCATION = {bounds: BOUNDS};

    let container: HTMLElement, map: YMap;
    beforeEach(() => {
        container = document.createElement('div');
        Object.assign(container.style, {width: `643px`, height: `856px`});
        document.body.appendChild(container);
        map = new ymaps3.YMap(container, {location: LOCATION}, [new ymaps3.YMapDefaultSchemeLayer({})]);
    });

    afterEach(() => {
        map.destroy();
        container.remove();
    });

    it('should make map', () => {
        map.addChild(
            new ymaps3.YMapControls({position: 'bottom'}, [
                new YMapButtonExample({
                    text: 'Some text',
                    className: 'user-class',
                    onClick: () => {
                        console.log('Click!');
                    }
                })
            ])
        );

        const tree = domToJson(map.container);
        expect(tree).toMatchSnapshot();
    });
});
