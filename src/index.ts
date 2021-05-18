import { colorPickerComponent } from './component.js';

class colorPicker extends HTMLElement {
	pickerElement: colorPickerComponent;
	private _width = '15rem';
	private _visibility = false;
	constructor() {
		super();
		const root = this.attachShadow({ mode: 'open' });

		const pre = document.createElement('button');
		pre.classList.add('colorPicker-pre');
		root.appendChild(pre);

		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = '../../style/colorPickerStyle.css';
		root.appendChild(link);

		this.pickerElement = new colorPickerComponent(pre, false, '15rem');

		document.addEventListener('click', (e) => {
			if (e.target instanceof HTMLElement) {
				if (e.target === this) {
					this.pickerElement.visibility(true);
				} else {
					this.pickerElement.visibility(false);
				}
			}
		});
	}
	connectedCallback() {
		if (!this.hasAttribute('width')) {
			this.setAttribute('width', '15rem');
		}
		if (!this.hasAttribute('visibility')) {
			this.setAttribute('visibility', 'false');
		}
	}

	static get observedAttributes() {
		return ['width', 'PickerVisible'];
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		oldValue;
		switch (name) {
			case 'width':
				this.width = newValue;
				break;

			case 'visibility':
				this.visibility = newValue;
				break;
			default:
				break;
		}
	}

	public get width() {
		return this._width;
	}
	public set width(input) {
		this._width = input;
		this.setAttribute('width', input);
		this.pickerElement.component.style.setProperty(
			`--colorPicker-width`,
			input
		);
		this.pickerElement.resize();
	}

	public get visibility() {
		return this._visibility.toString();
	}
	public set visibility(input) {
		this._visibility = input === 'true';
		this.pickerElement.visibility(this._visibility);
		this.setAttribute('value', input.toString());
	}
}

customElements.define('color-picker', colorPicker);
