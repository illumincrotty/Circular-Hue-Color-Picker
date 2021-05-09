import {
	colorUtils as cu,
	timingUtils as tu,
	positionsUtils as pu,
} from './utilities.js';
export { handle };

class handle {
	//#region class variables
	handle: HTMLElement;
	id: number;
	active = false;
	locked: cu.hsl_color_generic<boolean> = {
		hue: false,
		saturation: false,
		lightness: false,
	};
	color: cu.hsl_color = { hue: 0, saturation: 0, lightness: 50 };
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
		changeFunction: cu.colorChangeFunction
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

	remove = () => {
		console.debug('Removing Self');
		this.handle.remove();
	};

	setDimensions(parent: HTMLElement, force?: boolean) {
		if (this.dimensions.offset === -1 || force) {
			const wheelDimensions = parent.getBoundingClientRect();
			const handleDimensions = this.handle.getBoundingClientRect();

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
	up = () => {
		this.active = false;
	};

	down = (parentElement: HTMLElement) => {
		this.setDimensions(parentElement);
		this.active = true;
	};

	private unthrottledMove = (e: MouseEvent) => {
		if (this.active) {
			this.click(e);
		}
	};

	click = (e: MouseEvent) => {
		const x = e.clientX - this.dimensions.bcrX;
		const y = e.clientY - this.dimensions.bcrY;
		this.updateFromPosition({
			x: x - this.dimensions.offset,
			y: y - this.dimensions.offset,
		});
	};

	private unthrottledTouchMove = (e: TouchEvent) => {
		const x = e.targetTouches[0].clientX - this.dimensions.bcrX;
		const y = e.targetTouches[0].clientY - this.dimensions.bcrY;
		this.updateFromPosition({
			x: x - this.dimensions.offset,
			y: y - this.dimensions.offset,
		});
	};

	moving = tu.throttle(this.unthrottledMove, 16);
	touchMoving = tu.throttle(this.unthrottledTouchMove, 30);

	//#endregion event listener implementation

	select = () => {
		this.handle.style.setProperty('--scaleFactor', `1.2`);
		this.handle.style.setProperty('--borderColor', `var(--Main)`);
	};

	deselect = () => {
		this.handle.style.scale = '';
		this.handle.style.setProperty('--scaleFactor', `1`);
		this.handle.style.setProperty(
			'--borderColor',
			`var(--Secondary)`
		);
	};
	private updateFromPosition = (pt: pu.cartPt) => {
		this.updateFromColor(this.polarToColor(pu.cartToPolar(pt)));
	};

	updateFromColor = (color: cu.hsl_color) => {
		if (this.locked.hue) {
			color.hue = this.color.hue;
		}
		if (this.locked.saturation) {
			color.saturation = this.color.saturation;
		}
		if (this.locked.lightness) {
			color.lightness = this.color.lightness;
		}

		const pt = pu.polarToCart(
			this.colorToPolarCoordinates(color)
		);
		this.update(pt, color);
	};

	updateFromColorSubtype = (change: cu.colorSubtypeValue) => {
		const currentColor = cu.colorCopy(this.color);
		currentColor[change.type] = change.value;
		this.updateFromColor(currentColor);
	};

	colorToPolarCoordinates = (color: cu.hsl_color): pu.polarPt => {
		return {
			theta: pu.degreesToRadians(color.hue - 90),
			radius: Math.min(
				(color.saturation / 100) *
					this.dimensions.functionalRad,
				this.dimensions.functionalRad
			),
		};
	};

	polarToColor = (pt: pu.polarPt): cu.hsl_color => {
		return {
			hue: (pu.radiansToDegrees(pt.theta) + 360 + 90) % 360,
			saturation:
				100 *
				(Math.min(pt.radius, this.dimensions.functionalRad) /
					this.dimensions.functionalRad),
			lightness: this.color.lightness,
		};
	};

	private update(cartPt: pu.cartPt, color: cu.hsl_color) {
		// console.debug('Update');
		// console.debug(cartPt);
		// console.debug(color);
		this.changeFunction({
			type: 'full',
			value: this.updateHelper(cartPt, color),
			source: 'wheel',
		});
	}

	updateHelper(cartPt: pu.cartPt, color: cu.hsl_color) {
		this.updateColor(color);
		this.updatePosition(cartPt);
		return color;
	}

	private updateColor = (color: cu.hsl_color) => {
		// const colString = cu.hslColorToCssString(color);
		// console.debug(colString);
		this.color = color;
		this.handle.style.backgroundColor = cu.hslColorToCssString(
			color
		);
	};
	private updatePosition = (pt: pu.cartPt) => {
		this.handle.style.setProperty('--handleXOffset', `${pt.x}`);
		this.handle.style.setProperty('--handleYOffset', `${pt.y}`);
	};
}
