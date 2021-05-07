export { setUp, coordinateUtilities, colorUtilities };

namespace setUp {
	// append new child node and complete setup
	export const addAndSetUp = async (
		parent: HTMLElement,
		child: HTMLElement,
		position: "front" | "end"
	): Promise<void> => {
		return new Promise((resolve) => {
			const observer = new ResizeObserver(() => {
				if (child.getBoundingClientRect().width != 0) {
					observer.disconnect();
					return resolve();
				}
			});

			observer.observe(child);
			if (position === "front") {
				if (parent.childNodes.length > 0) {
					parent.insertBefore(child, parent.childNodes[0]);
				} else {
					position = "end";
				}
			}
			if (position === "end") {
				parent.appendChild(child);
			}
		});
	};
}

namespace coordinateUtilities {
	//convert between grid systems and set their types
	export type cartesianCoordinates = { x: number; y: number };
	export type polarCoordinates = { radius: number; angle: number };

	export const cartDistanceSquare = (
		p1: cartesianCoordinates,
		p2: cartesianCoordinates
	) => {
		const x = p2.x - p1.x;
		const y = p2.y - p1.y;
		return x ** 2 + y ** 2;
	};

	export const cartSubtract = (
		p1: cartesianCoordinates,
		p2: cartesianCoordinates
	) => {
		return {
			x: p2.x - p1.x,
			y: p2.y - p1.y,
		};
	};
	export function toRadians(angle: number) {
		return angle * (Math.PI / 180);
	}

	export const cartToPolar = (
		cartCoords: cartesianCoordinates
	): polarCoordinates => {
		return {
			radius: Math.sqrt(cartCoords.x ** 2 + cartCoords.y ** 2),
			angle:
				(Math.atan2(cartCoords.y, cartCoords.x) * (180 / Math.PI) +
					360) %
				360,
		};
	};
	export const polarToCart = (
		polarCoords: polarCoordinates
	): cartesianCoordinates => {
		const angle = toRadians(polarCoords.angle);
		return {
			x: polarCoords.radius * Math.cos(angle),
			y: polarCoords.radius * Math.sin(angle),
		};
	};

	export type circle = { radius: number; center: cartesianCoordinates };
}

namespace colorUtilities {
	//actual constant
	export const colorSubtypeList: colorSubtype[] = [
		"hue",
		"saturation",
		"lightness",
	];

	//types
	export type colorSubtypeChange = { type: colorSubtype; value: number };
	export type colorChange =
		| colorSubtypeChange
		| { type: "hsl"; value: colorPicker_HSLcolor };

	export type colorSubtype = "hue" | "saturation" | "lightness";

	export type options = {
		final?: boolean;
		reset?: boolean;
		lock?: boolean;
	};

	export type colorEventSource = "wheel" | "slider" | "lock" | "reset";

	//interfaces
	export interface colorPicker_color<Type> {
		hue: Type;
		saturation: Type;
		lightness: Type;
	}
	export interface colorPicker_HSLcolor extends colorPicker_color<number> {
		hue: number;
		saturation: number;
		lightness: number;
	}

	//functions
	export const colorToCssString = (color: colorPicker_HSLcolor) => {
		return `hsl(${color.hue},${color.saturation}%,${color.lightness}%)`;
	};

	export const colorPicker_colorToListOfChangeEvents = (
		color: colorPicker_HSLcolor
	): colorSubtypeChange[] => {
		const change: colorSubtypeChange[] = [];

		change.push({ type: "hue", value: color.hue });
		change.push({ type: "saturation", value: color.saturation });
		change.push({ type: "lightness", value: color.lightness });

		return change;
	};

	export const createColorEvent = (
		source: colorEventSource,
		colorChange: colorChange,
		options?: options
	) => {
		const colorDetail = new colorDetailClass(source, colorChange, options);

		return new CustomEvent("colorPicker-colorChange", {
			bubbles: true,
			cancelable: true,
			detail: colorDetail,
		});
	};

	//class
	export class colorDetailClass {
		source;
		final = false;
		reset = false;
		lock: boolean | undefined;
		mode = "hsl";
		change: colorChange;
		constructor(
			source: colorEventSource,
			change: colorChange,
			options?: options
		) {
			this.source = source;
			this.change = change;

			this.final = options?.final || false;
			this.reset = options?.reset || false;
			this.lock = options?.lock;
		}
	}
}
