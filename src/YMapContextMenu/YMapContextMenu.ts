import './index.css';

type VerticalPosition = 'top' | 'bottom';
type HorizontalPosition = 'left' | 'right';
type Position =
    | VerticalPosition
    | HorizontalPosition
    | `${VerticalPosition} ${HorizontalPosition}`
    | `${HorizontalPosition} ${VerticalPosition}`;

export interface YMapContextMenuProps {
    /** Показывает или скрывает контекстное меню. */
    visible: boolean;
    /** Координаты экрана, в которых должно отображаться контекстное меню. */
    screenCoordinates: [number, number];
    /** Ширина контекстного меню в пикселях (по умолчанию 240px). */
    width?: number;
    /** Позиция контекстного меню относительно указателя (по умолчанию позиция bottom right). */
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
    static defaultProps = defaultMenuProps;
    static [ymaps3.optionsKeyVuefy] = {props: ['visible', 'screenCoordinates', 'width', 'position']};

    private _element?: HTMLHeadingElement;
    private _container?: HTMLDivElement = document.createElement('div');
    private _detachDom?: () => void;

    constructor(props: YMapContextMenuProps) {
        super(props, {container: true});
    }

    private _createElement() {
        const contextMenuHtmlElement = document.createElement('div');
        contextMenuHtmlElement.classList.add('ymaps3--context-menu');
        contextMenuHtmlElement.style.width = `${this._props.width}px`;
        console.log('this.children', this.children);

        for (const child of this.children) {
            console.log('this.child', child);
            contextMenuHtmlElement.appendChild((child as unknown as {_container: HTMLDivElement})._container);
        }
        this._element = contextMenuHtmlElement;
        this._container.appendChild(this._element);
    }

    protected _onAttach() {
        this._createElement();
        this._detachDom = ymaps3.useDomContext(this, this._element, this._container);
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
        this._detachDom = undefined;
        this._element = undefined;
        this._container = undefined;
    }
}

export interface YMapContextMenuItemProps {
    /**
     * Показывает или скрывает пункт контекстного меню.
     */
    visible: boolean;
    /**
     * Текст пункта меню
     */
    text: string;
    /**
     * Ссылка на иконку или HTML элемент с иконкой для пункта меню (optional).
     */
    icon?: string | HTMLElement;
    /**
     * Позиция иконки (по умолчанию "start")
     */
    iconPosition?: 'start' | 'end';
    /**
     * Callback функция для обработки клика по пункту меню
     */
    onClick: () => void;
    /**
     * Флаг, что пункт меню не активен (по умолчанию false)
     */
    disabled?: boolean;
    /**
     * Устанавливает порядок размещения пункта в списке (по умолчанию 0).
     */
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

export class YMapContextMenuItem extends ymaps3.YMapEntity<YMapContextMenuItemProps, DefaultMenuItemProps> {
    static defaultProps = defaultMenuItemProps;
    static [ymaps3.optionsKeyVuefy] = {props: ['visible', 'text', 'iconPosition', 'onClick', 'disabled', 'order']};

    constructor(props: YMapContextMenuItemProps) {
        super(props);
    }

    private _element?: HTMLButtonElement;
    private _container?: HTMLDivElement = document.createElement('div');
    private _detachDom: () => void;

    private _createElement() {
        const contextMenuItemHtmlElement = document.createElement('button');
        contextMenuItemHtmlElement.classList.add('ymaps3--context-menu-item');
        contextMenuItemHtmlElement.type = 'button';
        contextMenuItemHtmlElement.onclick = this._props.onClick;
        contextMenuItemHtmlElement.disabled = this._props.disabled;
        contextMenuItemHtmlElement.style.order = String(this._props.order);

        if (this._props.visible) {
            contextMenuItemHtmlElement.classList.add('ymaps3--context-menu-item_visible');
        }

        if (this._props.icon) {
            const iconBlock = document.createElement('div');
            if (typeof this._props.icon === 'string') {
                const img = document.createElement('img');
                img.src = this._props.icon;
                img.alt = 'icon';
                img.style.width = '24px';
                img.style.height = '24px';
                iconBlock.appendChild(img);
            } else if (this._props.icon instanceof Element) {
                iconBlock.appendChild(this._props.icon);
            }

            const textBlock = document.createElement('div');
            textBlock.innerText = this._props.text;
            if (this._props.iconPosition === 'end') {
                contextMenuItemHtmlElement.appendChild(iconBlock);
                contextMenuItemHtmlElement.appendChild(textBlock);
            } else {
                contextMenuItemHtmlElement.appendChild(textBlock);
                contextMenuItemHtmlElement.appendChild(iconBlock);
            }
        } else {
            contextMenuItemHtmlElement.innerText = this._props.text;
        }

        this._element = contextMenuItemHtmlElement;
        this._container.appendChild(this._element);
    }

    protected _onUpdate(props: Partial<YMapContextMenuItemProps>): void {
        if (props.disabled !== undefined) {
            this._element.disabled = props.disabled;
        }
    }

    protected _onAttach() {
        this._createElement();
        this._detachDom = ymaps3.useDomContext(this.root, this._element, this._container);
    }

    protected _onDetach() {
        this._detachDom();
        this._detachDom = null;
        this._element = null;
        this._container = undefined;
    }
}
