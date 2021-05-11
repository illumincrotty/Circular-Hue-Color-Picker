import { colorChange, colorChangeFunction } from './colorUtilities';

export interface changeOrNum extends colorChangeFunction {
	(input: colorChange | number): void;
}

export abstract class subComponents {
	abstract changeFunction: changeOrNum;
	abstract update(change: colorChange): void;
	abstract logState(): void;
	abstract name: string;
	abstract resize(): void;
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
		for (const fn of this.eventSet) {
			fn(event);
		}
	}
}

export type selectedColor = number;

export const colorStateManger = new PubSub<
	colorChange | selectedColor
>();
