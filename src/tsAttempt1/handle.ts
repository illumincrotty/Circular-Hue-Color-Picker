import {
	setUp,
	coordinateUtilities,
	colorUtilities,
} from "./colorUtilities.js";

class handle {
	handle: HTMLDivElement;
	parentRadius;
	saturation = 100;
	lightnessBase = 50;
	radiusSquare = 0;
	position!: coordinateUtilities.cartesianCoordinates;
	halfRadius = 0;
	color!: colorUtilities.colorPicker_HSLcolor;
	id: string;
	locked: colorUtilities.colorPicker_color<boolean> = {
		hue: false,
		saturation: false,
		lightness: false,
	};

	constructor(parentElement: HTMLDivElement, shift: number, id: string) {
		this.id = id;
		//call into existence
		this.handle = document.createElement("div");
		this.handle.className = "colorPicker-handle";
		this.handle.id = "colorPicker-handle" + id;
		parentElement.appendChild(this.handle);
		this.parentRadius = shift;

		const repaint = setUp.addAndSetUp(parentElement, this.handle, "end");
		repaint.then(() => {
			this.setSizes(parentElement, shift);
		});
		this.update();
	}
	lock(type: colorUtilities.colorSubtype, lock: boolean) {
		console.log(`${type} is locked on handle: ${lock}`);
		this.locked[type] = lock;
	}

	colorChangeSingle(type: colorUtilities.colorSubtype, value: number) {
		const colorCopy = {
			hue: this.color.hue,
			saturation: this.color.saturation,
			lightness: this.color.lightness,
		};
		if (type === "lightness") {
			if (!this.locked[type]) {
				if (value != null) {
					this.lightnessBase = value;
				}
				this.update(this.position);
			}
		} else {
			if (!this.locked[type]) {
				colorCopy[type] = value;
			}
			this.colorChange(colorCopy);
		}
	}

	hueReset() {
		this.update();
	}

	colorChange(color: colorUtilities.colorPicker_HSLcolor) {
		// console.debug(`Handle colorChange to ${colorToCssString(color)}`);
		if (this.locked.hue) {
			color.hue = this.color.hue;
		}
		if (this.locked.saturation) {
			color.saturation = this.color.saturation;
		} else {
			this.saturation = color.saturation;
		}
		if (this.locked.lightness) {
			color.lightness = this.color.lightness;
		}

		const polar = this._colorToPosition(color);
		const cart = coordinateUtilities.polarToCart(polar);
		this.update(cart, polar, color);
	}
	updatePosition = (cart: coordinateUtilities.cartesianCoordinates) => {
		this.update(cart);
	};

	// private updatePolar(polar:polarCoordinates){
	// 	this.update(polarToCart(polar),polar)
	// }

	private update = (
		position: coordinateUtilities.cartesianCoordinates = { x: 0, y: 0 },
		polarPosition?: coordinateUtilities.polarCoordinates,
		color?: colorUtilities.colorPicker_HSLcolor
	) => {
		const polar =
			polarPosition ?? coordinateUtilities.cartToPolar(position);
		if (this.locked.hue) {
			polar.angle = this._hueToAngle(this.color.hue);
		}
		if (this.locked.saturation) {
			this.color.saturation = this.color.saturation;
		}
		if (this.locked.lightness) {
			polar.radius = this._lightnessToRadius(this.color.lightness);
		}

		//stay within color wheel
		polar.radius = Math.min(
			polar.radius,
			this.parentRadius - this.halfRadius
		);

		const limPos = coordinateUtilities.polarToCart(polar);

		this._updatePosition(limPos);
		this._updateColor(color ?? this._positionToColor(polar));
	};

	_updatePosition(position: coordinateUtilities.cartesianCoordinates) {
		this.position = position;
		const x = this.parentRadius + position.x;
		const y = this.parentRadius - position.y;
		// console.debug(`Updating position to (${position.x},${position.y})`);
		this.handle.style.top = `${y}px`;
		this.handle.style.left = `${x}px`;
	}

	_updateColor = (color: colorUtilities.colorPicker_HSLcolor) => {
		// console.debug(`Handle Color to ${colorToCssString(color)}`);
		this.color = color;
		this.handle.dispatchEvent(
			colorUtilities.createColorEvent("wheel", {
				type: "hsl",
				value: color,
			})
		);
		this.handle.style.background = colorUtilities.colorToCssString(color);
	};

	_positionToColor = (
		position: coordinateUtilities.polarCoordinates = { radius: 0, angle: 0 }
	): colorUtilities.colorPicker_HSLcolor => {
		return {
			hue: this.locked.hue
				? this.color.hue
				: this._angletoHue(position.angle),
			saturation: this.locked.saturation
				? this.color.saturation
				: this.saturation,
			lightness: this.locked.lightness
				? this.color.lightness
				: this._radiusToLightness(position.radius),
		};
	};

	_angletoHue = (angle: number): number => {
		return 360 - ((angle + 180 + 90) % 360);
	};
	_radiusToLightness = (rad: number): number => {
		return (
			this.lightnessBase +
			50 * (1 - rad / (this.parentRadius - this.halfRadius))
		);
	};

	_colorToPosition = (
		color: colorUtilities.colorPicker_HSLcolor
	): coordinateUtilities.polarCoordinates => {
		return {
			radius: this._lightnessToRadius(color.lightness),
			angle: this._hueToAngle(color.hue),
		};
	};

	_lightnessToRadius = (lightness: number) => {
		return (
			(1 - (lightness - this.lightnessBase) / 50) *
			(this.parentRadius - this.halfRadius)
		);
	};

	_hueToAngle = (hue: number) => {
		return 360 - hue + 90;
	};

	resize = (parentElement: HTMLDivElement, shift: number) => {
		this.setSizes(parentElement, shift);
	};

	setSizes = (parentElement: HTMLDivElement, shift: number) => {
		this.parentRadius =
			shift -
			parseInt(
				getComputedStyle(parentElement).getPropertyValue(
					"border-left-width"
				)
			);
		this.halfRadius = this.handle.clientWidth / 2;
		this.radiusSquare = this.handle.offsetWidth ** 2;
		this.update(this.position);
	};
}

export default handle;
