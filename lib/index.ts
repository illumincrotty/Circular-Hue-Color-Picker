import { ColorPickerComponent } from './component';
import { launchButton, root } from './style/base.css';
import { State } from './utilities/stateUtilities';
import css from '../dist/style.css';

// Console.info(css);

class colorPicker extends HTMLElement {
	openButton: HTMLElement;
	pickerElement!: ColorPickerComponent;
	state: State = new State();
	base: HTMLElement;
	shadow: ShadowRoot;

	constructor() {
		super();

		this.style.display = 'block';

		this.shadow = this.attachShadow({ mode: 'open' });
		this.base = document.createElement('div');
		this.base.classList.add(`${root}`);
		this.base.style.display = 'block';
		this.base.style.height = 'inherit';
		this.shadow.appendChild(this.base);

		this.openButton = document.createElement('button');
		this.openButton.setAttribute('aria-label', 'open color picker');
		this.openButton.classList.add(`${launchButton}`);
	}

	connectedCallback(): this {
		const font = document.createElement('style');
		font.type = 'text/css';
		font.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@500&display=swap');`;
		this.prepend(font);

		const parent = this.base;

		//
		// const link = document.createElement("link");
		// link.rel = "stylesheet";
		// link.href = URL("/dist/style.css");
		// this.shadow.appendChild(link);

		//
		const style = document.createElement('style');
		style.type = 'text/css';

		//
		style.textContent = css;
		//
		// style.innerHTML = eval(' ""+font_css_ts_vanilla + base_css_ts_vanilla + cpStyle_css_ts_vanilla + range_css_ts_vanilla') as string ?? '';
		this.shadow.appendChild(style);
		if (this.standalone) {
			this.pickerElement = new ColorPickerComponent(parent, this.state, {
				standAlone: true,
				width: this.width ?? '15rem',
				maxColors: this.maxColors ?? '5',
			});
		} else {
			parent.appendChild(this.openButton);
			this.pickerElement = new ColorPickerComponent(
				this.openButton,
				this.state,
				{
					standAlone: false,
					width: this.width ?? '15rem',
					maxColors: this.maxColors ?? '5',
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
		console.log(e.target);
		if (e.target instanceof HTMLElement) {
			if (e.target === this && !this.standalone) {
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
			case 'maxColors':
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

	public get maxColors(): string | undefined {
		return this.getAttribute('maxColors') ?? undefined;
	}

	public set maxColors(input: string | undefined) {
		if (input) {
			this.setAttribute('maxColors', input);
		}
	}
}

customElements.define('color-picker', colorPicker);

export { colorPicker };
