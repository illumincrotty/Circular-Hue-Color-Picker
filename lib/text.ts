import { copyButton,
	numInput,
	svgButton,
	svgButtonWrapper,
	textWrap
} from './style/cpStyle.css';
import type {
	changeSource,
	colorChange,
	colorChangeExtended,
	colorSubtype,
	hsl_color_generic,
} from './utilities/colorUtilities';
import { defaultColor, hslColorToCssString } from './utilities/colorUtilities';
import type { State, subComponents } from './utilities/stateUtilities';
export { TextInput };

interface inputOptions {
	min?: number;
	max?: number;
	step?: number;
	placeholder?: number;
}
class TextInput implements subComponents {
	name: changeSource = 'text';
	numberInputs: hsl_color_generic<HTMLInputElement>;
	fullSpan: HTMLDivElement;
	copy!: HTMLButtonElement;
	colorText = '';

	constructor(parentElement: HTMLElement, state: State) {
		state.subscribe(this);

		this.fullSpan = document.createElement('div');
		this.fullSpan.classList.add(`${textWrap}`);

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

		const commonUpdate = (
			sub: colorSubtype,
			max: number
		): colorChangeExtended => {
			return {
				type: 'subtype',
				value: {
					type: sub,
					value: parseInt(this.numberInputs[sub].value, 10) % max || 0,
				},
				source: 'text',
			};
		};

		this.fullSpan.addEventListener('change', (ev) => {
			const { target } = ev;
			if (target instanceof HTMLInputElement) {
				if (target === this.numberInputs.hue) {
					state.color = commonUpdate('hue', 360);
				}

				if (target === this.numberInputs.saturation) {
					state.color = commonUpdate('saturation', 100);
				}

				if (target === this.numberInputs.lightness) {
					state.color = commonUpdate('lightness', 100);
				}
			}
		});

		parentElement.appendChild(this.fullSpan);
	}

	createCopyButton(): void {
		this.copy = document.createElement('button');
		this.copy.classList.add(`${svgButtonWrapper}`, `${copyButton}`);

		this.copy.addEventListener('click', () => {
			navigator.clipboard
				.writeText(this.colorText)
				.then(() => {
					return;
				})
				.catch((error: Readonly<Error>) => {
					console.error(`Copy failed! ${error.message}`);
				});
		});

		this.copy.append(this.colorText);

		this.copy.innerHTML =
			`<svg role="img" viewBox="2.5 0 20 24" style="fill-rule: evenodd; clip-rule: evenodd;" class="${svgButton}"><path d="M6.8 19v3.1c0 1 .9 1.9 1.9 1.9h11.7c1 0 1.9-.8 1.9-1.9V7c0-1-.8-1.9-1.9-1.9h-2.3V1.9c0-1-.9-1.9-1.9-1.9H4.5c-1 0-1.9.8-1.9 1.9V17c0 1 .8 1.9 1.9 1.9h2.3zM20.1 7.8H9v13.4h11V7.8zM15.8 5V2.8h-11v13.4h2V7c0-1 .9-1.9 1.9-1.9h7.1z"></path></svg>`;

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
		input.classList.add(`${numInput}`);

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
