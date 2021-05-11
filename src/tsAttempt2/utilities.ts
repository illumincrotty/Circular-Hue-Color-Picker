export module colorUtils {
	export type colorSubtype = 'hue' | 'saturation' | 'lightness';

	export interface colorSubtypeValue {
		type: colorSubtype;
		value: number;
	}
	// if (VAR.type === "hue") {
	// } else if (VAR.type === "saturation") {
	// } else if (VAR.type === "lightness") {
	// }
	export type changeSource =
		| 'wheel'
		| 'text'
		| 'slider'
		| 'component';

	export type colorChange =
		| {
				type: 'subtype';
				value: colorSubtypeValue;
				source?: changeSource;
		  }
		| { type: 'full'; value: hsl_color; source?: changeSource };

	export interface hsl_color_generic<type> {
		hue: type;
		saturation: type;
		lightness: type;
	}
	export interface hsl_color extends hsl_color_generic<number> {
		hue: NonNullable<number>;
		saturation: NonNullable<number>;
		lightness: NonNullable<number>;
	}

	export interface colorChangeFunction {
		(input: colorChange): void;
	}

	// export interface colorChangeFunction {
	// 	(...any: any[]): colorChange;
	// }
	// export interface colorChangeFunctionNoArgs
	// 	extends colorChangeFunction {
	// 	(): colorChange;
	// }

	// export function colorChangeFunctionClosure(
	// 	callback: colorChangeFunction,
	// 	...args: Parameters<colorChangeFunction>
	// ): colorChangeFunctionNoArgs {
	// 	return () => {
	// 		return callback(...args);
	// 	};
	// }

	export function defaultColor(): hsl_color {
		return { hue: 0, saturation: 0, lightness: 50 };
	}

	export function colorCopy<type>(
		color: hsl_color_generic<type>
	): hsl_color_generic<type> {
		return {
			hue: color.hue,
			saturation: color.saturation,
			lightness: color.lightness,
		};
	}

	export const hslColorToCssString = (color: hsl_color) => {
		return `hsl(${Math.floor(color.hue)},${Math.floor(
			color.saturation
		)}%,${Math.floor(color.lightness)}%)`;
	};
}

export module positionsUtils {
	export type polarPt = { theta: number; radius: number };
	export type cartPt = { x: number; y: number };
	export type pt = polarPt | cartPt;

	export const cartToPolar = (pt: cartPt): polarPt => {
		return {
			theta: Math.atan2(pt.y, pt.x),
			radius: Math.hypot(pt.x, pt.y),
		};
	};
	export const polarToCart = (pt: polarPt): cartPt => {
		return {
			x: pt.radius * Math.cos(pt.theta),
			y: pt.radius * Math.sin(pt.theta),
		};
	};
	export function radiansToDegrees(theta: number) {
		return (theta * 180) / Math.PI;
	}
	export function degreesToRadians(theta: number) {
		return theta * (Math.PI / 180);
	}
}

export module timingUtils {
	export const debounce = <fn extends (...args: any[]) => void>(
		callback: fn,
		wait: number
	) => {
		let timeout = -1;

		return (...args: Parameters<fn>) => {
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(() => {
				callback(...args);
			}, wait);
		};
	};

	export const throttle = <fn extends (...args: any[]) => any>(
		callback: fn,
		wait: number
	) => {
		let first = true;
		let calledBeforeThrottleTimerOver = false;
		let recentArgs: Parameters<fn>;

		const call = () => {
			callback(...recentArgs);
		};

		const delayedCall = () => {
			setTimeout(() => {
				call();
				if (calledBeforeThrottleTimerOver) {
					calledBeforeThrottleTimerOver = false;
					delayedCall();
				} else {
					first = true;
				}
			}, wait);
		};

		return (...args: Parameters<fn>) => {
			recentArgs = args;
			if (first) {
				first = false;
				call();
				delayedCall();
				return;
			}
			if (!calledBeforeThrottleTimerOver) {
				calledBeforeThrottleTimerOver = true;
			}
		};
	};
}

export module stateUtils {
	export interface changeOrNum
		extends colorUtils.colorChangeFunction {
		(input: colorUtils.colorChange | number): void;
	}

	export abstract class subComponents {
		abstract changeFunction: changeOrNum;
		abstract update(change: colorUtils.colorChange): void;
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
		colorUtils.colorChange | selectedColor
	>();
}
