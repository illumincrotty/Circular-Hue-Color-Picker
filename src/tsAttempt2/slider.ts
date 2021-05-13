import {
	changeSource,
	hsl_color_generic,
	colorSubtype,
	colorChange,
	colorChangeExtended,
} from './utilities/colorUtilities.js';
import {
	subComponents,
	colorStateManger,
	emitColorChange,
} from './utilities/stateUtilities.js';

export { sliders };
class sliders extends subComponents {
	name: changeSource = 'slider';
	sliderWrapper: HTMLDivElement;
	ranges!: hsl_color_generic<range>;
	constructor(parentElement: HTMLElement, id: number) {
		super();
		this.sliderWrapper = document.createElement('div');
		this.sliderWrapper.classList.add('colorPicker-container');
		parentElement.appendChild(this.sliderWrapper);

		colorStateManger.subscribe(this.colorChangeHandler.bind(this));

		this.createRanges(id);
	}

	createRanges = (id: number): void => {
		this.ranges = {
			hue: new range(this.sliderWrapper, id, {
				name: 'hue',
				min: 0,
				max: 360,
				default: 0,
			}),
			saturation: new range(this.sliderWrapper, id, {
				name: 'saturation',
				min: 0,
				max: 100,
				default: 0,
			}),
			lightness: new range(this.sliderWrapper, id, {
				name: 'lightness',
				min: 0,
				max: 100,
				default: 50,
			}),
		};
	};

	colorChangeHandler(change: colorChange): void {
		if (change.source !== 'slider') {
			this.ranges.hue.update(change.color.hue);
			this.ranges.saturation.update(change.color.saturation);
			this.ranges.lightness.update(change.color.lightness);
			return;
		}
	}

	logState(): void {
		console.info(this);
		console.group('ranges');
		console.info(this.ranges);
		console.groupEnd();
	}
}

type rangeOpts = {
	name: colorSubtype;
	min: number;
	max: number;
	default: number;
	stepSize?: number;
};
class range {
	input: HTMLInputElement;
	default: number;
	constructor(parentElement: HTMLElement, id: number, options: rangeOpts) {
		this.default = options.default;

		const wrapper = document.createElement('div');
		wrapper.classList.add('colorPicker-range');
		const label = document.createElement('label');
		const capitalLabel =
			options.name[0].toUpperCase() + options.name.slice(1);
		label.textContent = capitalLabel;
		label.style.marginRight = '100%';
		label.setAttribute('for', `colorPicker-${capitalLabel}-slider-${id}`);

		wrapper.appendChild(label);

		this.input = document.createElement('input');
		this.input.setAttribute('type', 'range');
		this.input.setAttribute('min', `${options.min}`);
		this.input.setAttribute('max', `${options.max}`);
		this.input.setAttribute('value', `${options.default}`);
		this.input.id = `colorPicker-${capitalLabel}-slider-${id}`;
		this.input.style.width = '100%';
		this.input.classList.add('colorPicker-slider');

		this.input.addEventListener('input', () => {
			emitColorChange({
				type: 'subtype',
				value: {
					type: options.name,
					value: parseFloat(this.input.value),
				},
				source: 'slider',
			} as colorChangeExtended);
		});
		wrapper.appendChild(this.input);

		parentElement.appendChild(wrapper);
	}

	reset = () => {
		this.input.value = this.default.toString();
	};

	update(change: number) {
		this.input.value = `${change}`;
	}
}
