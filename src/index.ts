import { colorPickerComponent } from './component.js';

class colorPicker extends HTMLElement {
	openButton: HTMLElement;
	pickerElement!: colorPickerComponent;
	root;
	constructor() {
		super();
		this.style.visibility = 'hidden';

		this.root = this.attachShadow({ mode: 'open' });

		//Add Styles
		void new Promise(() => {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = '../../style/colorPickerStyle.css';
			this.root.appendChild(link);
		});

		this.openButton = document.createElement('button');
		this.openButton.setAttribute('aria-label', 'open color picker');
		this.openButton.classList.add('colorPicker-opener');
	}

	connectedCallback() {
		if (this.standalone) {
			this.pickerElement = new colorPickerComponent(
				this.root,
				true,
				this.width,
				this.maxcolors
			);
		} else {
			this.root.appendChild(this.openButton);
			this.pickerElement = new colorPickerComponent(
				this.openButton,
				false,
				this.width,
				this.maxcolors
			);
			document.addEventListener(
				'click',
				this.clickEventListener.bind(this)
			);
		}

		void this.makeVisible();
	}

	disconnectedCallback() {
		window.removeEventListener('click', this.clickEventListener.bind(this));
	}

	clickEventListener = (e: MouseEvent | TouchEvent) => {
		if (e.target instanceof HTMLElement) {
			console.log(e.target);
			if (e.target === this && !this.standalone) {
				this.pickerElement.hide(false);
			} else {
				this.pickerElement.hide(true);
			}
		}
	};

	async makeVisible() {
		await new Promise(() => {
			return setTimeout(() => {
				this.style.removeProperty('visibility');
			}, 4);
		});
	}

	static get observedAttributes() {
		return ['width'];
	}

	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		oldValue;
		console.log(name);
		switch (name) {
			case 'width':
				this.pickerElement?.component?.style.setProperty(
					`--colorPicker-width`,
					newValue
				);
				this.pickerElement?.resize();
				break;

			case 'standalone':
				break;
			case 'maxcolors':
				break;
			default:
				break;
		}
	}

	public get width() {
		return this.getAttribute('width') ?? undefined;
	}
	public set width(input) {
		if (input) this.setAttribute('width', input);
	}

	public get standalone() {
		return this.hasAttribute('standalone');
	}

	public set standalone(input) {
		if (input) {
			this.setAttribute('standalone', '');
		} else {
			this.removeAttribute('standalone');
		}
	}

	public get maxcolors() {
		return this.getAttribute('maxcolors') ?? undefined;
	}
	public set maxcolors(input) {
		if (input) this.setAttribute('maxcolors', input);
	}
}

customElements.define('color-picker', colorPicker);
