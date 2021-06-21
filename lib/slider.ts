import type {
	changeSource,
	hsl_color_generic,
	colorSubtype,
	colorChange,
} from './utilities/colorUtilities';
import type { subComponents, State } from './utilities/stateUtilities';

export { Slider };
class Slider implements subComponents {
	name: changeSource = 'slider';
	sliderWrapper: HTMLDivElement;
	ranges!: hsl_color_generic<Range>;
	constructor(parentElement: HTMLElement, id: number, state: State) {
		this.sliderWrapper = document.createElement('div');
		this.sliderWrapper.classList.add('sliderWrapperStyle');
		parentElement.appendChild(this.sliderWrapper);
		state.subscribe(this);
		this.createRanges(id, state);
	}

	createRanges = (id: number, state: State): void => {
		this.ranges = {
			hue: new Range(this.sliderWrapper, id, state, {
				name: 'hue',
				min: 0,
				max: 360,
				default: 0,
			}),
			saturation: new Range(this.sliderWrapper, id, state, {
				name: 'saturation',
				min: 0,
				max: 100,
				default: 0,
			}),
			lightness: new Range(this.sliderWrapper, id, state, {
				name: 'lightness',
				min: 0,
				max: 100,
				default: 50,
			}),
		};

		this.ranges.hue.input.classList.add('hueSliderStyle');
		this.ranges.saturation.input.classList.add('saturationSliderStyle');
		this.ranges.lightness.input.classList.add('lightnessSliderStyle');
	};

	colorChangeHandler(change: colorChange): void {
		if (change.source !== 'slider') {
			this.sliderWrapper.style.setProperty('--hue', `${change.color.hue}`);
			this.sliderWrapper.style.setProperty(
				'--saturation',
				`${change.color.saturation}%`
			);
			this.sliderWrapper.style.setProperty(
				'--lightness',
				`${change.color.lightness}%`
			);
			this.ranges.hue.update(change.color.hue);
			this.ranges.saturation.update(change.color.saturation);
			this.ranges.lightness.update(change.color.lightness);
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
class Range {
	input: HTMLInputElement;
	default: number;
	constructor(
		parentElement: HTMLElement,
		id: number,
		state: State,
		options: rangeOpts
	) {
		this.default = options.default;

		const wrapper = document.createElement('div');
		wrapper.classList.add('rangeStyle');
		const label = document.createElement('label');
		const capitalLabel = options.name[0].toUpperCase() + options.name.slice(1);
		label.textContent = capitalLabel;
		label.setAttribute('for', `colorPicker-${capitalLabel}-slider-${id}`);

		wrapper.appendChild(label);

		this.input = document.createElement('input');
		this.input.setAttribute('type', 'range');
		this.input.setAttribute('min', `${options.min}`);
		this.input.setAttribute('max', `${options.max}`);
		this.input.setAttribute('value', `${options.default}`);
		this.input.id = `colorPicker-${capitalLabel}-slider-${id}`;

		this.input.addEventListener('input', () => {
			state.color = {
				type: 'subtype',
				value: {
					type: options.name,
					value: parseFloat(this.input.value),
				},
				source: 'slider',
			};
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
