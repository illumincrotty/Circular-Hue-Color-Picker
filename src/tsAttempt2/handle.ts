import {
	hsl_color_generic,
	hsl_color,
	colorChangeFunction,
	colorSubtypeValue,
	colorCopy,
	hslColorToCssString,
} from './utilities/colorUtilities';
import {
	cartPt,
	cartToPolar,
	polarToCart,
	polarPt,
	degreesToRadians,
	radiansToDegrees,
} from './utilities/positionUtilities';
import { throttle } from './utilities/timingUtilities';

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
	changeFunction;

	//#endregion class variables

	constructor(
		parent: HTMLElement,
		idNumber: number,
		changeFunction: colorChangeFunction
	) {
		//create element and add its class
		this.handle = document.createElement('div');
		this.handle.classList.add('colorPicker-handle');
		this.id = idNumber;
		this.select();
		this.changeFunction = changeFunction;

		//add self to dom
		parent.appendChild(this.handle);
	}

	remove = (): void => {
		console.debug('Removing Self');
		this.handle.remove();
	};

	setDimensions(parent: HTMLElement, force?: boolean): void {
		if (this.dimensions.offset === -1 || force) {
			const wheelDimensions = parent.getBoundingClientRect();
			const handleDimensions =
				this.handle.getBoundingClientRect();

			this.dimensions.handleBorder = parseFloat(
				getComputedStyle(this.handle).borderTopWidth.slice(
					0,
					-2
				)
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
					this.dimensions.handleBorder);
			this.dimensions.bcrX = wheelDimensions.x;
			this.dimensions.bcrY = wheelDimensions.y;

			console.debug(this.dimensions);
		}
	}

	//#region event listener implementation
	up = (): void => {
		this.active = false;
	};

	down = (parentElement: HTMLElement): void => {
		this.setDimensions(parentElement);
		this.active = true;
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
			const x =
				e.targetTouches[0].clientX - this.dimensions.bcrX;
			const y =
				e.targetTouches[0].clientY - this.dimensions.bcrY;
			this.updateFromPosition({
				x: x - this.dimensions.offset,
				y: y - this.dimensions.offset,
			});
		}
	};
	touchMoving = throttle(this.unthrottledTouchMove, 30);

	//#endregion event listener implementation

	select = (): void => {
		this.handle.style.setProperty('--scaleFactor', `1.2`);
		this.handle.style.setProperty('--borderColor', `var(--Main)`);
	};

	deselect = (): void => {
		this.handle.style.scale = '';
		this.handle.style.setProperty('--scaleFactor', `1`);
		this.handle.style.setProperty(
			'--borderColor',
			`var(--Secondary)`
		);
	};
	private updateFromPosition = (pt: cartPt) => {
		this.updateFromColor(this.polarToColor(cartToPolar(pt)));
	};

	updateFromColor = (color: hsl_color): void => {
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
		this.update(pt, color);
	};

	updateFromColorSubtype = (change: colorSubtypeValue): void => {
		const currentColor = colorCopy(this.color);
		currentColor[change.type] = change.value;
		this.updateFromColor(currentColor);
	};

	colorToPolarCoordinates = (color: hsl_color): polarPt => {
		return {
			theta: degreesToRadians(color.hue - 90),
			radius: Math.min(
				(color.saturation / 100) *
					this.dimensions.functionalRad,
				this.dimensions.functionalRad
			),
		};
	};

	polarToColor = (pt: polarPt): hsl_color => {
		return {
			hue: (radiansToDegrees(pt.theta) + 360 + 90) % 360,
			saturation:
				100 *
				(Math.min(pt.radius, this.dimensions.functionalRad) /
					this.dimensions.functionalRad),
			lightness: this.color.lightness,
		};
	};

	private update(cartPt: cartPt, color: hsl_color) {
		// console.debug('Update');
		// console.debug(cartPt);
		// console.debug(color);
		this.changeFunction({
			type: 'full',
			value: this.updateHelper(cartPt, color),
			source: 'wheel',
		});
	}

	updateHelper(cartPt: cartPt, color: hsl_color): hsl_color {
		this.updateColor(color);
		this.updatePosition(cartPt);
		return color;
	}

	private updateColor = (color: hsl_color) => {
		// const colString = hslColorToCssString(color);
		// console.debug(colString);
		this.color = color;
		this.handle.style.backgroundColor =
			hslColorToCssString(color);
	};
	private updatePosition = (pt: cartPt) => {
		this.handle.style.setProperty('--handleXOffset', `${pt.x}`);
		this.handle.style.setProperty('--handleYOffset', `${pt.y}`);
	};
}
