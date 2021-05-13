import {
	changeSource,
	colorChange,
	defaultColor,
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
	name: changeSource = 'text';
	numberInputs: hsl_color_generic<HTMLInputElement> = {
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
	fullSpan: HTMLDivElement;
	constructor(parentElement: HTMLElement) {
		super();

		this.fullSpan = document.createElement('div');
		this.fullSpan.classList.add('colorPicker-text-wrapper');

		this.fullSpan.append(document.createTextNode('hsl('));
		this.fullSpan.append(this.numberInputs.hue);
		this.fullSpan.append(document.createTextNode(','));
		this.fullSpan.append(this.numberInputs.saturation);
		this.fullSpan.append(document.createTextNode('%,'));
		this.fullSpan.append(this.numberInputs.lightness);
		this.fullSpan.append(document.createTextNode('%)'));

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

	logState(): void {
		console.log(this);
	}

	colorChangeHandler(input: colorChange): void {
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
