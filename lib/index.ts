import { ColorPickerComponent } from './component';
import { launchButton, root } from './style/cpStyle.css';
import { State } from './utilities/stateUtilities';
import '../dist/style.css';

class colorPicker extends HTMLElement {
	openButton: HTMLElement;
	pickerElement!: ColorPickerComponent;
	state: State = new State();

	constructor() {
		super();
		this.classList.add(`${root}`);
		this.style.display = 'block';

		this.openButton = document.createElement('button');
		this.openButton.setAttribute('aria-label', 'open color picker');
		this.openButton.classList.add(`${launchButton}`);
	}

	connectedCallback(): this {
		if (this.standalone) {
			this.pickerElement = new ColorPickerComponent(
				this,
				this.state,
				{
					standAlone: true,
					width: this.width ?? '15rem',
					maxColors: this.maxcolors ?? '5',
				});
		} else {
			this.appendChild(this.openButton);
			this.pickerElement = new ColorPickerComponent(
				this.openButton,
				this.state,
				{
					standAlone: false,
					width: this.width ?? '15rem',
					maxColors: this.maxcolors ?? '5',
				}
			);
			document.addEventListener('click', this.clickEventListener.bind(this));
		}

		return this;
	}

	disconnectedCallback(): void {
		window.removeEventListener('click', this.clickEventListener.bind(this));
	}

	clickEventListener = (e: MouseEvent | TouchEvent): void => {
		if (e.target instanceof HTMLElement) {
			if (e.target === this.openButton && !this.standalone) {
				this.pickerElement.hidden = false;
			} else {
				this.pickerElement.hidden = true;
			}
		}
	};

	static get observedAttributes(): string[] {
		return ['width'];
	}

	attributeChangedCallback(
		name: string,
		oldValue: string,
		newValue: string
	): void {
		if (oldValue === newValue) {
			return;
		}

		console.log(name);
		switch (name) {
			case 'width':
				this.pickerElement.width = newValue;
				break;

			case 'standalone':
				break;
			case 'maxcolors':
				break;
			default:
				break;
		}
	}

	public get width(): string | undefined {
		return this.getAttribute('width') ?? undefined;
	}

	public set width(input: string | undefined) {
		if (input) {
			this.setAttribute('width', input);
		}
	}

	public get standalone(): boolean {
		return this.hasAttribute('standalone');
	}

	public set standalone(input: boolean) {
		if (input) {
			this.setAttribute('standalone', '');
		} else {
			this.removeAttribute('standalone');
		}
	}

	public get maxcolors(): string | undefined {
		return this.getAttribute('maxcolors') ?? undefined;
	}

	public set maxcolors(input: string | undefined) {
		if (input) {
			this.setAttribute('maxcolors', input);
		}
	}
}

customElements.define('color-picker', colorPicker);

export { colorPicker };
