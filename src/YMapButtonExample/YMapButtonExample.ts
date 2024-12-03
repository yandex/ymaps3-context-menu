import type {YMapControlButton, YMapControlButtonProps} from '@yandex/ymaps3-types';

interface YMapButtonExampleProps extends YMapControlButtonProps {
    className?: string;
}

export class YMapButtonExample extends ymaps3.YMapComplexEntity<YMapButtonExampleProps> {
    private _button?: YMapControlButton;
    private _element: HTMLElement = document.createElement('div');

    constructor(props: YMapButtonExampleProps) {
        super(props);
        this._element.classList.add(this._props.className);
    }

    protected _onAttach() {
        this._button = new ymaps3.YMapControlButton({...this._props, element: this._element});
        this.addChild(this._button);
    }

    protected _onUpdate(props: Partial<YMapButtonExampleProps>, oldProps: YMapButtonExampleProps) {
        this._button.update(props);

        if (props.className !== undefined) {
            this._element.classList.remove(oldProps.className);
            this._element.classList.add(props.className);
        }
    }

    protected _onDetach() {
        this.removeChild(this._button);
    }
}
