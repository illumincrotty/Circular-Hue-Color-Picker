import {
	changeSource,
	colorChange,
	defaultColor,
	hslColorToCssString,
	hsl_color_generic,
} from './utilities/colorUtilities.js';
import {
	colorStateManger,
	emitColorChange,
	subComponents,
} from './utilities/stateUtilities.js';
export { textInput };

interface inputOptions {
	min?: number;
	max?: number;
	step?: number;
	placeholder?: number;
}
class textInput extends subComponents {
	name: changeSource = 'text';
	numberInputs: hsl_color_generic<HTMLInputElement>;
	fullSpan: HTMLDivElement;
	copy!: HTMLButtonElement;
	colorText = '';

	constructor(parentElement: HTMLElement) {
		super();

		this.fullSpan = document.createElement('div');
		this.fullSpan.classList.add('colorPicker-text-wrapper');

		this.numberInputs = {
			hue: this.createNumberInput({
				max: 360,
				placeholder: defaultColor().hue,
			}),
			saturation: this.createNumberInput({
				placeholder: defaultColor().saturation,
			}),
			lightness: this.createNumberInput({
				placeholder: defaultColor().lightness,
			}),
		};

		this.fullSpan.append(document.createTextNode('hsl('));
		this.fullSpan.append(this.numberInputs.hue);
		this.fullSpan.append(document.createTextNode(','));
		this.fullSpan.append(this.numberInputs.saturation);
		this.fullSpan.append(document.createTextNode('%,'));
		this.fullSpan.append(this.numberInputs.lightness);
		this.fullSpan.append(document.createTextNode('%) '));
		this.createCopyButton();

		colorStateManger.subscribe(this.colorChangeHandler.bind(this));

		this.fullSpan.addEventListener('change', (ev) => {
			const target = ev.target;
			if (target === this.numberInputs.hue) {
				emitColorChange({
					type: 'subtype',
					value: {
						type: 'hue',
						value: parseInt(this.numberInputs.hue.value) % 360 || 0,
					},
					source: 'text',
				});
			}
			if (target === this.numberInputs.saturation) {
				emitColorChange({
					type: 'subtype',
					value: {
						type: 'saturation',
						value:
							parseInt(this.numberInputs.saturation.value) || 0,
					},
					source: 'text',
				});
			}
			if (target === this.numberInputs.lightness) {
				emitColorChange({
					type: 'subtype',
					value: {
						type: 'lightness',
						value:
							parseInt(this.numberInputs.lightness.value) || 50,
					},
					source: 'text',
				});
			}
		});

		parentElement.appendChild(this.fullSpan);
	}
	createCopyButton(): void {
		this.copy = document.createElement('button');
		this.copy.classList.add('colorPicker-svg-button-wrap');
		this.copy.style.width = '1rem';
		this.copy.style.height = '1rem';
		this.copy.style.cursor = 'copy';
		this.copy.style.verticalAlign = 'text-bottom';

		this.copy.onclick = () => {
			navigator.clipboard
				.writeText(this.colorText)
				.then(() => {
					return;
				})
				.catch((error: Error) => {
					alert(`Copy failed! ${error.message}`);
				});
		};

		this.copy.append(this.colorText);

		const svgCopy = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		);
		svgCopy.setAttribute('role', 'img');
		svgCopy.setAttribute('viewBox', '2.5 0 20 24');
		svgCopy.style.fillRule = 'evenodd';
		svgCopy.style.clipRule = 'evenodd';
		svgCopy.classList.add('colorPicker-svg-button');
		svgCopy.innerHTML = `<path d="M6.8 19v3.1c0 1 .9 1.9 1.9 1.9h11.7c1 0 1.9-.8 1.9-1.9V7c0-1-.8-1.9-1.9-1.9h-2.3V1.9c0-1-.9-1.9-1.9-1.9H4.5c-1 0-1.9.8-1.9 1.9V17c0 1 .8 1.9 1.9 1.9h2.3zM20.1 7.8H9v13.4h11V7.8zM15.8 5V2.8h-11v13.4h2V7c0-1 .9-1.9 1.9-1.9h7.1z"/>`;

		this.copy.append(svgCopy);

		this.fullSpan.append(this.copy);
	}
	createNumberInput = (options?: inputOptions): HTMLInputElement => {
		const input = document.createElement('input');
		input.setAttribute('type', 'text');
		input.setAttribute('inputmode', 'numeric');
		input.setAttribute('pattern', '[0-9]*');
		input.setAttribute('min', `${options?.min ?? 0}`);
		input.setAttribute('max', `${options?.max ?? 100}`);
		input.setAttribute('step', `${options?.step ?? 1}`);
		input.setAttribute('placeholder', `${options?.placeholder ?? 50}`);
		input.classList.add('colorPicker-number-input');
		return input;
	};

	logState(): void {
		console.log(this);
	}

	colorChangeHandler(input: colorChange): void {
		this.colorText = hslColorToCssString(input.color);
		if (input.source !== 'text') {
			this.numberInputs.hue.value = `${Math.round(input.color.hue)}`;
			this.numberInputs.saturation.value = `${Math.round(
				input.color.saturation
			)}`;
			this.numberInputs.lightness.value = `${Math.round(
				input.color.lightness
			)}`;
		}
	}
}
