import type {
	changeSource,
	colorChangeExtended,
	hsl_color,
	colorChange,
} from './colorUtilities';
import { defaultColor } from './colorUtilities';

export interface subComponents {
	name?: changeSource;
	children?: subComponents[];
	colorChangeHandler?(input: colorChange): void;
	selectedChangeHandler?(input: selectedChange): void;
	resizeHandler?(): void;
	maxColorChangeHandler?(input: number): void;
	logState(): void;
}

class PubSub<validParams> {
	private readonly eventSet: Set<(arg: validParams) => void> = new Set();

	subscribe(fn: (event: validParams) => void) {
		this.eventSet.add(fn);
	}

	unsubscribe(fn: (event: validParams) => void) {
		this.eventSet.delete(fn);
	}

	notify(event: validParams) {
		this.eventSet.forEach((fn) => fn(event));
	}
}

type colorChangeSimple = {
	color: hsl_color;
	source?: changeSource;
};
type selectedChange = NonNullable<number> | 'new' | 'delete';

export class State {
	private colors: hsl_color[] = [];
	get color(): colorChangeExtended {
		return { type: 'full', value: this.colors[this.currentSelectedIndex] };
	}

	set color(input: colorChangeExtended) {
		this.changeColor(input);
	}

	private currentSelectedIndex = -1;

	get selected(): number {
		return this.currentSelectedIndex;
	}

	set selected(value: number) {
		this.changeSelected(value);
	}

	private _maxColors = 5;

	public get maxColors() {
		return this._maxColors;
	}

	public set maxColors(value: number) {
		this._maxColors = value;
		this.MaxColorsState.notify(value);
	}

	private readonly colorState = new PubSub<colorChangeSimple>();
	private readonly selectedState = new PubSub<selectedChange>();
	private readonly resizeAlert = new PubSub<void>();
	private readonly MaxColorsState = new PubSub<number>();

	resize = () => {
		this.resizeAlert.notify();
	};

	subscribe(input: subComponents) {
		if (input.colorChangeHandler) {
			this.colorState.subscribe(input.colorChangeHandler.bind(input));
		}

		if (input.selectedChangeHandler) {
			this.selectedState.subscribe(input.selectedChangeHandler.bind(input));
		}

		if (input.maxColorChangeHandler) {
			this.MaxColorsState.subscribe(input.maxColorChangeHandler.bind(input));
		}

		if (input.resizeHandler) {
			this.resizeAlert.subscribe(input.resizeHandler.bind(input));
		}
	}

	addColor() {
		if (this.colors.length < this.maxColors) {
			this.currentSelectedIndex = this.colors.push(defaultColor()) - 1;
			this.selectedState.notify('new');
			this.selectedState.notify(this.colors.length - 1);
		}

		this.commonNotify();
	}

	removeColor() {
		if (this.colors.length > 1) {
			this.colors.splice(this.currentSelectedIndex, 1);
			this.currentSelectedIndex = this.colors.length - 1;
			this.selectedState.notify('delete');
			this.selectedState.notify(this.currentSelectedIndex);
		} else {
			console.warn('attempting to remove only color');
		}

		this.commonNotify();
	}

	private changeColor(input: colorChangeExtended) {
		if (input.type === 'full') {
			this.colors[this.currentSelectedIndex] = input.value;
		}

		if (input.type === 'subtype') {
			this.colors[this.currentSelectedIndex][input.value.type] =
				input.value.value;
		}

		this.commonNotify();

		return;
	}

	private readonly changeSelected = (input: number): void => {
		if (input < this.colors.length) {
			this.currentSelectedIndex = input;
		}

		this.selectedState.notify(this.currentSelectedIndex);
		this.commonNotify();
	};

	private readonly commonNotify = (): void => {
		this.colorState.notify({
			color: this.colors[this.currentSelectedIndex],
			source: 'component',
		});
	};
}
