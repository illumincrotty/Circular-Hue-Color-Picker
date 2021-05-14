import {
	changeSource,
	colorChangeExtended,
	defaultColor,
	hsl_color,
	colorChange,
} from './colorUtilities.js';

export abstract class subComponents {
	abstract colorChangeHandler(input: colorChange): void;
	abstract logState(): void;
	abstract name: changeSource;
}
class PubSub<validParams> {
	private eventSet: Set<(arg: validParams) => void> = new Set();

	subscribe(fn: (event: validParams) => void) {
		this.eventSet.add(fn);
	}

	unsubscribe(fn: (event: validParams) => void) {
		this.eventSet.delete(fn);
	}

	notify(event: validParams) {
		return this.eventSet.forEach((fn) => fn(event));
	}
}

export type selectedColor = number;

export const colorStateManger = new PubSub<{
	color: hsl_color;
	source?: changeSource;
}>();
export const selectedStateManger = new PubSub<
	selectedColor | 'new' | 'delete'
>();
export const resizeAlert = new PubSub<void>();

export const emitSelectedChange = (
	input: NonNullable<number> | 'new' | 'delete'
): void => {
	if (typeof input == 'string') {
		if (input === 'new') {
			if (colors.length < 5) {
				currentSelectedIndex = colors.push(defaultColor()) - 1;
				selectedStateManger.notify('new');
				selectedStateManger.notify(colors.length - 1);
			}
		}
		if (input === 'delete') {
			if (colors.length > 1) {
				colors.splice(currentSelectedIndex, 1);
				currentSelectedIndex = colors.length - 1;
				selectedStateManger.notify('delete');
				selectedStateManger.notify(currentSelectedIndex);
			} else {
				console.warn('attempting to remove only color');
			}
		}
		colorStateManger.notify({
			color: colors[currentSelectedIndex],
			source: 'component',
		});
	} else {
		if (input < colors.length) {
			currentSelectedIndex = input;
		}
		selectedStateManger.notify(currentSelectedIndex);
		colorStateManger.notify({
			color: colors[currentSelectedIndex],
			source: 'component',
		});
	}
};

export const emitColorChange = (input: colorChangeExtended): void => {
	if (input.type === 'full') {
		colors[currentSelectedIndex] = input.value;
	}
	if (input.type === 'subtype') {
		colors[currentSelectedIndex][input.value.type] = input.value.value;
	}
	colorStateManger.notify({
		color: colors[currentSelectedIndex],
		source: input.source,
	});
};

const colors: hsl_color[] = [];
let currentSelectedIndex = -1;
