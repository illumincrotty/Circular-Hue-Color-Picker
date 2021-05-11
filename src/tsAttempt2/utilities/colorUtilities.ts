export type colorSubtype = 'hue' | 'saturation' | 'lightness';

export interface colorSubtypeValue {
	type: colorSubtype;
	value: number;
}
// if (VAR.type === "hue") {
// } else if (VAR.type === "saturation") {
// } else if (VAR.type === "lightness") {
// }
export type changeSource = 'wheel' | 'text' | 'slider' | 'component';

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

export const hslColorToCssString = (color: hsl_color): string => {
	return `hsl(${Math.floor(color.hue)},${Math.floor(
		color.saturation
	)}%,${Math.floor(color.lightness)}%)`;
};
