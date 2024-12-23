import {CustomVuefyOptions} from '@yandex/ymaps3-types/modules/vuefy';
import './index.css';

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

const defaultProps = Object.freeze({
    iconPosition: 'start',
    disabled: false,
    order: 0
});

type DefaultProps = typeof defaultProps;

export class YMapContextMenuItem extends ymaps3.YMapComplexEntity<YMapContextMenuItemProps, DefaultProps> {
    static [ymaps3.optionsKeyVuefy]: CustomVuefyOptions<YMapContextMenuItem> = {
        props: ['visible', 'text', 'iconPosition', 'onClick', 'disabled', 'order']
    };
    static defaultProps = defaultProps;

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
            (this._iconBlock.firstChild as HTMLImageElement).src = this._props.icon;
        } else if (this._props.icon instanceof Element) {
            this._iconBlock.replaceChild(this._iconBlock.firstChild, this._props.icon);
        }

        if (!this._element.contains(this._iconBlock) && this._props.icon) {
            this._element.appendChild(this._iconBlock);
        } else if (this._element.contains(this._iconBlock) && !this._props.icon) {
            this._element.removeChild(this._iconBlock);
        }
    }

    protected _onUpdate(): void {
        this._updateElement();
        this._updateIconBlock();
        this._updateTextBlock();
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
