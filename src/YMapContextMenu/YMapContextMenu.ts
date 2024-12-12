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

const defaultMenuProps: YMapContextMenuProps = Object.freeze({
    visible: false,
    screenCoordinates: [0, 0] as [number, number],
    width: 290,
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
        super(props, {container: true});
    }

    protected _onAttach() {
        this._element = document.createElement('div');
        this._element.classList.add('ymaps3--context-menu');
        this._element.style.width = `${this._props.width}px`;
        this._detachDom = ymaps3.useDomContext(this, this._element, this._element);
    }

    private _getPositionCoordinates(screenCoordinates: [number, number], position: Position, x: number, y: number) {
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

    _onUpdate(props: Partial<YMapContextMenuProps>): void {
        if (props.visible !== undefined) {
            if (props.visible) {
                this._element.classList.add('ymaps3--context-menu_visible');
            } else {
                this._element.classList.remove('ymaps3--context-menu_visible');
            }
        }

        if (props.width !== undefined) {
            this._element.style.width = `${this._props.width}px`;
        }

        if (props.screenCoordinates !== undefined) {
            const {screenCoordinates, position} = props;
            const {x, y} = this.root.container.getBoundingClientRect();
            const {top, left} = this._getPositionCoordinates(screenCoordinates, position, x, y);
            this._element.style.left = `${left}px`;
            this._element.style.top = `${top}px`;
        }
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

const defaultMenuItemProps: YMapContextMenuItemProps = Object.freeze({
    visible: false,
    text: '',
    iconPosition: 'start',
    onClick: () => {},
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
    private _detachDom?: () => void;

    private _createOrUpdateElement(element: HTMLButtonElement, props: YMapContextMenuItemProps) {
        if (!element.classList.contains('ymaps3--context-menu-item')) {
            element.classList.add('ymaps3--context-menu-item');
        }
        element.type = 'button';
        element.onclick = props.onClick;
        element.disabled = props.disabled;
        element.style.order = String(props.order);

        if (props.visible) {
            element.classList.add('ymaps3--context-menu-item_visible');
        } else {
            element.classList.remove('ymaps3--context-menu-item_visible');
        }

        element.childNodes.forEach((child) => {
            element.removeChild(child);
        });

        const iconBlock = document.createElement('div');
        if (typeof props.icon === 'string') {
            const img = document.createElement('img');
            img.classList.add('ymaps3--context-menu-item-icon');
            img.src = props.icon;
            img.alt = 'icon';
            iconBlock.appendChild(img);
        } else if (props.icon instanceof Element) {
            iconBlock.appendChild(props.icon);
        }

        const textBlock = document.createElement('div');
        textBlock.innerText = props.text;

        if (props.icon) {
            element.appendChild(iconBlock);
        }
        element.appendChild(textBlock);

        if (props.iconPosition === 'start') {
            element.classList.add('ymaps3--context-menu-item-icon_start');
        } else {
            element.classList.add('ymaps3--context-menu-item-icon_end');
        }

        return element;
    }

    protected _onUpdate(props: Partial<YMapContextMenuItemProps>, oldProps: YMapContextMenuItemProps): void {
        const mergedProps = {
            ...oldProps,
            ...props
        };
        this._createOrUpdateElement(this._element, mergedProps);
    }

    protected _onAttach() {
        const contextMenuItemHtmlElement = document.createElement('button');
        this._element = this._createOrUpdateElement(contextMenuItemHtmlElement, this._props);
        this._detachDom = ymaps3.useDomContext(this, this._element, null);
    }

    protected _onDetach() {
        this._detachDom?.();
        this._detachDom = null;
        this._element = null;
    }
}
