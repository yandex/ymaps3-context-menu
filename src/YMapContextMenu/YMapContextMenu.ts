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

const defaultMenuProps = Object.freeze({
    width: 240,
    position: 'bottom right'
});

type DefaultMenuProps = typeof defaultMenuProps;

export class YMapContextMenu extends ymaps3.YMapGroupEntity<YMapContextMenuProps, DefaultMenuProps> {
    static [ymaps3.optionsKeyVuefy]: CustomVuefyOptions<YMapContextMenu> = {
        props: ['visible', 'screenCoordinates', 'width', 'position']
    };
    static defaultProps = defaultMenuProps;

    private _element: HTMLDivElement;
    private _detachDom: () => void;

    constructor(props: YMapContextMenuProps) {
        super(props);
    }

    private _updatePositionCoordinates() {
        const {screenCoordinates, position} = this._props;
        const {x, y} = this.root.container.getBoundingClientRect();
        const {top, left} = this._getPositionCoordinates(screenCoordinates, position, x, y);
        this._element.style.left = `${left}px`;
        this._element.style.top = `${top}px`;
    }

    private _createElement() {
        const element = document.createElement('div');
        element.classList.add('ymaps3--context-menu');
        element.style.width = `${this._props.width}px`;

        return element;
    }

    private _updateElement() {
        this._element.classList.toggle('ymaps3--context-menu_visible', this._props.visible);
        this._element.style.width = `${this._props.width}px`;
    }

    private _getPositionCoordinates(screenCoordinates: [number, number], position: Position, x: number, y: number) {
        if (!screenCoordinates) {
            return {
                top: 0,
                left: 0
            };
        }

        const rect = this._element.getBoundingClientRect();
        let left = screenCoordinates[0] - x;
        let top = screenCoordinates[1] - y;

        if (position === 'right') {
            left = screenCoordinates[0] - x;
            top = screenCoordinates[1] - y - rect.height / 2;
        }

        if (position === 'top right' || position === 'right top') {
            left = screenCoordinates[0] - x;
            top = screenCoordinates[1] - y - rect.height;
        }

        if (position === 'bottom') {
            left = screenCoordinates[0] - x - rect.width / 2;
            top = screenCoordinates[1] - y;
        }

        if (position === 'top') {
            left = screenCoordinates[0] - x - rect.width / 2;
            top = screenCoordinates[1] - y - rect.height;
        }

        if (position === 'left') {
            left = screenCoordinates[0] - x - rect.width;
            top = screenCoordinates[1] - y - rect.height / 2;
        }

        if (position === 'left bottom' || position === 'bottom left') {
            left = screenCoordinates[0] - x - rect.width;
            top = screenCoordinates[1] - y;
        }

        if (position === 'left top' || position === 'top left') {
            left = screenCoordinates[0] - x - rect.width;
            top = screenCoordinates[1] - y - rect.height;
        }

        return {
            left,
            top
        };
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

export interface YMapContextMenuItemProps {
    /** Shows or hides the context menu item. */
    visible: boolean;
    /** Text of the menu item. */
    text: string;
    /** Reference to an icon or an HTML element with an icon for the menu item (optional). */
    icon?: string | HTMLElement;
    /** Position of the icon (default is "start"). */
    iconPosition?: 'start' | 'end';
    /** Callback function to handle a click on the menu item. */
    onClick: () => void;
    /** Flag indicating whether the menu item is disabled (default is false). */
    disabled?: boolean;
    /** Sets the order of the menu item in the list (default is 0). */
    order?: number;
}

const defaultMenuItemProps = Object.freeze({
    iconPosition: 'start',
    disabled: false,
    order: 0
});

type DefaultMenuItemProps = typeof defaultMenuProps;

export class YMapContextMenuItem extends ymaps3.YMapComplexEntity<YMapContextMenuItemProps, DefaultMenuItemProps> {
    static [ymaps3.optionsKeyVuefy]: CustomVuefyOptions<YMapContextMenuItem> = {
        props: ['visible', 'text', 'iconPosition', 'onClick', 'disabled', 'order']
    };
    static defaultProps = defaultMenuItemProps;

    public _element: HTMLButtonElement;
    public _iconBlock: HTMLDivElement;
    public _textBlock: HTMLDivElement;
    private _detachDom?: () => void;

    private _createElement() {
        const element = document.createElement('button');
        element.classList.add('ymaps3--context-menu-item');
        element.type = 'button';
        element.onclick = this._props.onClick;
        element.disabled = this._props.disabled;
        element.style.order = String(this._props.order);
        element.classList.toggle('ymaps3--context-menu-item_visible', this._props.visible);
        element.classList.toggle('ymaps3--context-menu-item-icon_end', this._props.iconPosition === 'end');

        return element;
    }

    private _updateElement() {
        this._element.onclick = this._props.onClick;
        this._element.disabled = this._props.disabled;
        this._element.style.order = String(this._props.order);
        this._element.classList.toggle('ymaps3--context-menu-item_visible', this._props.visible);
        this._element.classList.toggle('ymaps3--context-menu-item-icon_end', this._props.iconPosition === 'end');
    }

    private _createTextBlock() {
        const textBlock = document.createElement('div');
        textBlock.innerText = this._props.text;
        return textBlock;
    }

    private _updateTextBlock() {
        this._textBlock.innerText = this._props.text;
    }

    private _createIconBlock() {
        const iconBlock = document.createElement('div');
        if (typeof this._props.icon === 'string') {
            const img = document.createElement('img');
            img.classList.add('ymaps3--context-menu-item-icon');
            img.src = this._props.icon;
            img.alt = 'icon';
            iconBlock.appendChild(img);
        } else if (this._props.icon instanceof Element) {
            iconBlock.appendChild(this._props.icon);
        }
        return iconBlock;
    }

    private _updateIconBlock() {
        if (typeof this._props.icon === 'string') {
            const img = document.createElement('img');
            img.classList.add('ymaps3--context-menu-item-icon');
            img.src = this._props.icon;
            img.alt = 'icon';
            this._iconBlock.replaceChild(this._iconBlock.firstChild, img);
        } else if (this._props.icon instanceof Element) {
            this._iconBlock.replaceChild(this._iconBlock.firstChild, this._props.icon);
        }
    }

    protected _onUpdate(): void {
        this._updateElement();
        this._updateIconBlock();
        this._updateTextBlock();

        if (!this._element.contains(this._iconBlock) && this._props.icon) {
            this._element.appendChild(this._iconBlock);
        } else if (this._element.contains(this._iconBlock) && !this._props.icon) {
            this._element.removeChild(this._iconBlock);
        }
    }

    protected _onAttach() {
        this._element = this._createElement();
        this._iconBlock = this._createIconBlock();
        this._textBlock = this._createTextBlock();

        if (this._props.icon) {
            this._element.appendChild(this._iconBlock);
        }
        this._element.appendChild(this._textBlock);

        this._detachDom = ymaps3.useDomContext(this, this._element, null);
    }

    protected _onDetach() {
        this._detachDom?.();
        this._detachDom = null;
        this._element = null;
        this._iconBlock = null;
        this._textBlock = null;
    }
}
