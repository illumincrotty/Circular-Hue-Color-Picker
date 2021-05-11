export { colorUtils, positionsUtils, timingUtils, stateUtils };

namespace colorUtils {
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
		hue: number;
		saturation: number;
		lightness: number;
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

namespace positionsUtils {
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

namespace timingUtils {
	type AnyFunction = (...args: any[]) => any;
	export const throttle = (
		callback: AnyFunction,
		timeout: number = 300
	) => {
		let ready: boolean = true;
		return (
			...args: Parameters<AnyFunction>
		): ReturnType<AnyFunction> => {
			// console.log('throttled inner');
			if (!ready) {
				// console.log('throttled deny');
				return;
			}

			ready = false;
			setTimeout(() => {
				ready = true;
			}, timeout);
			return callback(...args);
		};
	};
}

namespace stateUtils {
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
