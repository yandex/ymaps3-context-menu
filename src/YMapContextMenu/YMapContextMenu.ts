import {CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import './index.css';

type VerticalPosition = 'top' | 'bottom';
type HorizontalPosition = 'left' | 'right';
type Position =
    | VerticalPosition
    | HorizontalPosition
    | `${VerticalPosition} ${HorizontalPosition}`
    | `${HorizontalPosition} ${VerticalPosition}`;

export interface YMapContextMenuProps {
    /** Shows or hides the context menu. */
    visible: boolean;
    /** Screen coordinates where the context menu should appear. */
    screenCoordinates: [number, number];
    /** Width of the context menu in pixels (default is 240px). */
    width?: number;
    /** Position of the context menu relative to the pointer (default is bottom right). */
    position?: Position;
}

const defaultProps = Object.freeze({
    width: 240,
    position: 'bottom right'
});

type DefaultProps = typeof defaultProps;

export class YMapContextMenu extends ymaps3.YMapGroupEntity<YMapContextMenuProps, DefaultProps> {
    static [ymaps3.optionsKeyVuefy]: CustomVuefyOptions<YMapContextMenu> = {
        props: ['visible', 'screenCoordinates', 'width', 'position']
    };
    static defaultProps = defaultProps;

    private _element: HTMLDivElement;
    private _detachDom: () => void;

    constructor(props: YMapContextMenuProps) {
        super(props);
    }

    private _updatePositionCoordinates() {
        const {top, left} = this._getPositionCoordinates();
        this._element.style.left = `${left}px`;
        this._element.style.top = `${top}px`;
    }

    private _createElement() {
        const element = document.createElement('div');
        element.classList.add('ymaps3--context-menu');
        element.style.width = `${this._props.width}px`;
        element.classList.toggle('ymaps3--context-menu_visible', this._props.visible);

        return element;
    }

    private _updateElement() {
        this._element.classList.toggle('ymaps3--context-menu_visible', this._props.visible);
        this._element.style.width = `${this._props.width}px`;
    }

    private _getPositionCoordinates(): {top: number; left: number} {
        const {screenCoordinates, position} = this._props;
        const {x, y} = this.root.container.getBoundingClientRect();

        if (!screenCoordinates) {
            return {top: 0, left: 0};
        }

        const rect = this._element.getBoundingClientRect();
        const [screenX, screenY] = screenCoordinates;

        const offsets: Record<Position, {dx: number; dy: number}> = {
            right: {dx: 0, dy: -rect.height / 2},
            'top right': {dx: 0, dy: -rect.height},
            'right top': {dx: 0, dy: -rect.height},
            bottom: {dx: -rect.width / 2, dy: 0},
            top: {dx: -rect.width / 2, dy: -rect.height},
            left: {dx: -rect.width, dy: -rect.height / 2},
            'left bottom': {dx: -rect.width, dy: 0},
            'bottom left': {dx: -rect.width, dy: 0},
            'left top': {dx: -rect.width, dy: -rect.height},
            'top left': {dx: -rect.width, dy: -rect.height},
            'bottom right': {dx: 0, dy: 0},
            'right bottom': {dx: 0, dy: 0}
        };

        const {dx = 0, dy = 0} = offsets[position] || {};

        const left = screenX - x + dx;
        const top = screenY - y + dy;

        return {left, top};
    }

    protected _onAttach() {
        this._element = this._createElement();
        this._updatePositionCoordinates();

        this._detachDom = ymaps3.useDomContext(this, this._element, this._element);
    }

    protected _onUpdate(): void {
        this._updateElement();
        this._updatePositionCoordinates();
    }

    protected _onDetach() {
        this._detachDom?.();
        this._detachDom = null;
        this._element = null;
    }
}
