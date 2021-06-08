import { handleStyle, theme } from './style/cpStyle.css';
import type {
	hsl_color_generic,
	hsl_color,
	changeSource,
} from './utilities/colorUtilities';
import { defaultColor, hslColorToCssString } from './utilities/colorUtilities';
import type { cartPt, polarPt } from './utilities/positionUtilities';
import {
	cartToPolar,
	polarToCart,
	degreesToRadians,
	radiansToDegrees,
} from './utilities/positionUtilities';
import type { State, subComponents } from './utilities/stateUtilities';
import { throttle } from './utilities/timingUtilities';

export { Handle };

class Handle implements subComponents {
	// #region class variables
	name = 'handle' as changeSource;
	handle: HTMLElement;
	id: number;
	active = false;
	locked: hsl_color_generic<boolean> = {
		hue: false,
		saturation: false,
		lightness: false,
	};

	color: hsl_color = defaultColor();
	dimensions = {
		offset: -1,
		functionalRad: -1,
		touchOffsetX: -1,
		touchOffsetY: -1,
	};
	// #endregion class variables

	constructor(parent: HTMLElement, idNumber: number, private state: State) {
		// Create element and add its class
		this.handle = document.createElement('div');
		this.handle.classList.add(`${handleStyle}`);
		// This.handle.tabIndex = 0;
		this.id = idNumber;
		this.select();

		// Add self to dom
		parent.appendChild(this.handle);
		this.updateColor(this.color);
	}

	static colorToPolarCoordinates = (
		color: hsl_color,
		functionalRad: number
	): polarPt => {
		return {
			theta: degreesToRadians(color.hue - 90) ?? 0,
			radius:
				Math.min((color.saturation / 100) * functionalRad, functionalRad) ??
				0,
		};
	};

	static polarToColor = (
		pt: polarPt,
		functionalRad: number,
		lightnessValue: number
	): hsl_color => {
		return {
			hue: (radiansToDegrees(pt.theta) + 360 + 90) % 360,
			saturation:
				100 * (Math.min(pt.radius, functionalRad) / functionalRad) ?? 0,
			lightness: lightnessValue,
		};
	};

	logState(): void {
		console.log(this);
	}

	setDimensions(parent: HTMLElement): void {
		const handleDimensions = this.handle.getBoundingClientRect();

		const handleRadius = handleDimensions.width / 2;
		const handleBorder = parseFloat(
			getComputedStyle(this.handle).borderTopWidth.slice(0, -2)
		);

		const wheelDimensions = parent.getBoundingClientRect();
		const wheelBorder = parseFloat(
			getComputedStyle(parent).borderTopWidth.slice(0, -2)
		);

		this.dimensions.offset = wheelDimensions.width / 2;
		this.dimensions.functionalRad =
				this.dimensions.offset - wheelBorder - handleRadius + handleBorder ??
				0;

		this.dimensions.touchOffsetX = wheelDimensions.x;
		this.dimensions.touchOffsetY = wheelDimensions.y;
	}

	remove = (): void => {
		this.handle.remove();
	};

	// #region event listener implementation
	up = (): void => {
		this.active = false;
	};

	down = (parentElement: HTMLElement, e: MouseEvent | TouchEvent): void => {
		this.setDimensions(parentElement);
		this.active = true;
		this.click(e);
	};

	click = (e: MouseEvent | TouchEvent): void => {
		this.updateFromPosition(
			e instanceof MouseEvent ? this.calcPosMouse(e) : this.calcPosTouch(e)
		);
	};

	calcPosMouse(e: MouseEvent): cartPt {
		return {
			x: e.clientX - this.dimensions.touchOffsetX - this.dimensions.offset,
			y: e.clientY - this.dimensions.touchOffsetY - this.dimensions.offset,
		};
	}

	calcPosTouch(e: TouchEvent): cartPt {
		return {
			x:
				e.targetTouches[0].clientX -
				this.dimensions.touchOffsetX -
				this.dimensions.offset,
			y:
				e.targetTouches[0].clientY -
				this.dimensions.touchOffsetY -
				this.dimensions.offset,
		};
	}

	private readonly unthrottledMove = (e: Readonly<MouseEvent>): void => {
		if (this.active) {
			this.click(e);
		}
	};

	moving = throttle(this.unthrottledMove, 30);

	private readonly unthrottledTouchMove = (e: TouchEvent) => {
		e.preventDefault();

		if (this.active) {
			const x = e.targetTouches[0].clientX - this.dimensions.touchOffsetX;
			const y = e.targetTouches[0].clientY - this.dimensions.touchOffsetY;
			this.updateFromPosition({
				x: x - this.dimensions.offset,
				y: y - this.dimensions.offset,
			});
		}
	};

	touchMoving = throttle(this.unthrottledTouchMove, 30);

	// #endregion event listener implementation

	select = (): void => {
		console.log('selecting');
		console.log(this);
		this.handle.focus();
		this.handle.style.setProperty('--scaleFactor', '1.2');
		this.handle.style.setProperty('--borderColor', `${theme.text}`);
	};

	deselect = (): void => {
		console.log('deselecting');
		console.log(this);
		this.handle.style.removeProperty('--scale');
		this.handle.style.setProperty('--scaleFactor', '1');
		this.handle.style.removeProperty('--borderColor');
	};

	updateFromColor = (color: hsl_color): void => {
		this.updateHelper(this.colorToPoints(color));
	};

	private readonly updateFromPosition = (pt: cartPt) => {
		this.update(
			this.colorToPoints(
				Handle.polarToColor(
					cartToPolar(pt),
					this.dimensions.functionalRad,
					this.color.lightness
				)
			)
		);
	};

	private readonly colorToPoints = (color: hsl_color): [cartPt, hsl_color] => {
		if (this.locked.hue) {
			color.hue = this.color.hue;
		}

		if (this.locked.saturation) {
			color.saturation = this.color.saturation;
		}

		if (this.locked.lightness) {
			color.lightness = this.color.lightness;
		}

		const pt = polarToCart(
			Handle.colorToPolarCoordinates(color, this.dimensions.functionalRad)
		);
		return [pt, color];
	};

	private update(input: [cartPt, hsl_color]) {
		this.state.color = {
			type: 'full',
			value: this.updateHelper(input),
			source: 'wheel',
		};
	}

	updateHelper(input: [cartPt, hsl_color]): hsl_color {
		this.updateColor(input[1]);
		this.updatePosition(input[0]);
		return input[1];
	}

	private readonly updateColor = (color: hsl_color) => {
		this.color = color;
		this.handle.style.backgroundColor = hslColorToCssString(color);
	};

	private readonly updatePosition = (pt: cartPt) => {
		this.handle.style.setProperty('--handleXOffset', `${pt.x}`);
		this.handle.style.setProperty('--handleYOffset', `${pt.y}`);
	};
}
