import {
	hsl_color_generic,
	hsl_color,
	hslColorToCssString,
	colorChangeExtended,
} from './utilities/colorUtilities.js';
import {
	cartPt,
	cartToPolar,
	polarToCart,
	polarPt,
	degreesToRadians,
	radiansToDegrees,
} from './utilities/positionUtilities.js';
import { emitColorChange } from './utilities/stateUtilities.js';
import { throttle } from './utilities/timingUtilities.js';

export { handle };

class handle {
	//#region class variables
	handle: HTMLElement;
	id: number;
	active = false;
	locked: hsl_color_generic<boolean> = {
		hue: false,
		saturation: false,
		lightness: false,
	};
	color: hsl_color = { hue: 0, saturation: 0, lightness: 50 };
	dimensions = {
		offset: -1,
		wheelBorder: -1,
		handleBorder: -1,
		functionalRad: -1,
		handleWidth: -1,
		bcrX: -1,
		bcrY: -1,
	};
	//#endregion class variables

	constructor(parent: HTMLElement, idNumber: number) {
		//create element and add its class
		this.handle = document.createElement('div');
		this.handle.classList.add('colorPicker-handle');
		// this.handle.tabIndex = 0;
		this.id = idNumber;
		this.select();

		//add self to dom
		parent.appendChild(this.handle);
	}

	setDimensions(parent: HTMLElement, force?: boolean): void {
		if (this.dimensions.offset === -1 || force) {
			const wheelDimensions = parent.getBoundingClientRect();
			const handleDimensions = this.handle.getBoundingClientRect();

			this.dimensions.handleBorder = parseFloat(
				getComputedStyle(this.handle).borderTopWidth.slice(0, -2)
			);
			this.dimensions.wheelBorder = parseFloat(
				getComputedStyle(parent).borderTopWidth.slice(0, -2)
			);
			this.dimensions.handleWidth = handleDimensions.width;
			this.dimensions.offset = wheelDimensions.width / 2;
			this.dimensions.functionalRad =
				wheelDimensions.width / 2 -
					this.dimensions.wheelBorder -
					(handleDimensions.width / 2 -
						this.dimensions.handleBorder) ?? 0;
			this.dimensions.bcrX = wheelDimensions.x;
			this.dimensions.bcrY = wheelDimensions.y;
		}
	}

	remove = (): void => {
		this.handle.remove();
	};

	//#region event listener implementation
	up = (): void => {
		this.active = false;
	};

	down = (parentElement: HTMLElement, e: MouseEvent): void => {
		this.setDimensions(parentElement, this.dimensions.functionalRad < 1);
		this.active = true;
		this.click(e);
	};

	click = (e: MouseEvent): void => {
		const x = e.clientX - this.dimensions.bcrX;
		const y = e.clientY - this.dimensions.bcrY;
		this.updateFromPosition({
			x: x - this.dimensions.offset,
			y: y - this.dimensions.offset,
		});
	};

	private unthrottledMove = (e: MouseEvent): void => {
		if (this.active) {
			this.click(e);
		}
	};
	moving = throttle(this.unthrottledMove, 30);

	private unthrottledTouchMove = (e: TouchEvent) => {
		if (this.active) {
			const x = e.targetTouches[0].clientX - this.dimensions.bcrX;
			const y = e.targetTouches[0].clientY - this.dimensions.bcrY;
			this.updateFromPosition({
				x: x - this.dimensions.offset,
				y: y - this.dimensions.offset,
			});
		}
	};
	touchMoving = throttle(this.unthrottledTouchMove, 30);

	//#endregion event listener implementation

	select = (): void => {
		this.handle.focus();
		this.handle.style.setProperty('--scaleFactor', `1.2`);
		this.handle.style.setProperty('--borderColor', `var(--Main)`);
	};

	deselect = (): void => {
		this.handle.style.scale = '';
		this.handle.style.setProperty('--scaleFactor', `1`);
		this.handle.style.setProperty('--borderColor', `var(--Secondary)`);
	};
	private updateFromPosition = (pt: cartPt) => {
		this.update(this.colorToPoints(this.polarToColor(cartToPolar(pt))));
	};

	updateFromColor = (color: hsl_color): void => {
		this.updateHelper(this.colorToPoints(color));
	};

	private colorToPoints = (color: hsl_color): [cartPt, hsl_color] => {
		if (this.locked.hue) {
			color.hue = this.color.hue;
		}
		if (this.locked.saturation) {
			color.saturation = this.color.saturation;
		}
		if (this.locked.lightness) {
			color.lightness = this.color.lightness;
		}

		const pt = polarToCart(this.colorToPolarCoordinates(color));
		return [pt, color];
	};

	colorToPolarCoordinates = (color: hsl_color): polarPt => {
		return {
			theta: degreesToRadians(color.hue - 90) ?? 0,
			radius:
				Math.min(
					(color.saturation / 100) * this.dimensions.functionalRad,
					this.dimensions.functionalRad
				) ?? 0,
		};
	};

	polarToColor = (pt: polarPt): hsl_color => {
		return {
			hue: (radiansToDegrees(pt.theta) + 360 + 90) % 360,
			saturation:
				100 *
					(Math.min(pt.radius, this.dimensions.functionalRad) /
						this.dimensions.functionalRad) || 0,
			lightness: this.color.lightness,
		};
	};

	private update(input: [cartPt, hsl_color]) {
		emitColorChange({
			type: 'full',
			value: this.updateHelper(input),
			source: 'wheel',
		} as colorChangeExtended);
	}

	updateHelper(input: [cartPt, hsl_color]): hsl_color {
		this.updateColor(input[1]);
		this.updatePosition(input[0]);
		return input[1];
	}

	private updateColor = (color: hsl_color) => {
		this.color = color;
		this.handle.style.backgroundColor = hslColorToCssString(color);
	};
	private updatePosition = (pt: cartPt) => {
		this.handle.style.setProperty('--handleXOffset', `${pt.x}`);
		this.handle.style.setProperty('--handleYOffset', `${pt.y}`);
	};
}
