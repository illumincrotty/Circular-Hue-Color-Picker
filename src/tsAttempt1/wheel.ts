import {
	setUp,
	coordinateUtilities,
	colorUtilities,
} from "./colorUtilities.js";
import handle from "./handle.js";

class colorWheel {
	static logging = false;

	_colorWheelElement: HTMLDivElement;
	_circle!: coordinateUtilities.circle;

	selected!: handle;
	handles: handle[];
	id;

	//animation tools
	isMouseDown = false;
	needRAF = false;
	startPos!: coordinateUtilities.cartesianCoordinates;
	currentPos!: coordinateUtilities.cartesianCoordinates;

	constructor(parentElement: HTMLElement, id: string) {
		this.id = id;

		//add color wheel to dom
		this._colorWheelElement = document.createElement("div");
		this._colorWheelElement.className = "colorPicker-colorWheel";
		this._colorWheelElement.id = `colorPicker-colorWheel-${this.id}`;

		const repaint = setUp.addAndSetUp(
			parentElement,
			this._colorWheelElement,
			"front"
		);

		repaint.then(() => {
			this._circle = this.setUp();

			//add default handle
			this.addHandle();
		});

		this.handles = [];

		this._colorWheelElement.addEventListener(
			"mousedown",
			this.mouseDown.bind(this)
		);
		this._colorWheelElement.addEventListener(
			"mousemove",
			this.mouseMove.bind(this)
		);
		this._colorWheelElement.addEventListener(
			"mouseup",
			this.mouseUp.bind(this)
		);
	}

	setUp = (): coordinateUtilities.circle => {
		const rad = this._colorWheelElement.getBoundingClientRect().width / 2;

		if (colorWheel.logging) {
			console.debug("Constructing circle");
			console.debug(this._colorWheelElement.getBoundingClientRect());
			console.debug(`Radius = ${rad}`);
		}
		return {
			radius: rad,
			center: {
				x: this._colorWheelElement.getBoundingClientRect().left + rad,
				y: this._colorWheelElement.getBoundingClientRect().top + rad,
			},
		};
	};

	addHandle = () => {
		if (colorWheel.logging) {
			console.debug(`Adding handle, radius: ${this._circle.radius}`);
		}
		this.handles.push(
			new handle(
				this._colorWheelElement,
				this._circle.radius,
				this.id + "-" + this.handles.length
			)
		);
		this.selected = this.handles[this.handles.length - 1];
	};

	colorChange(changeEvent: colorUtilities.colorDetailClass) {
		// const change = changeEvent.change;

		if (typeof changeEvent.change.value === "number") {
			const { type, value } = changeEvent.change as {
				type: colorUtilities.colorSubtype;
				value: number;
			};
			if (changeEvent.lock !== undefined) {
				this.selected.lock(
					type as colorUtilities.colorSubtype,
					changeEvent.lock
				);
			} else {
				if (type === "hue") {
					if (changeEvent.reset) {
						this.selected.hueReset();
					} else {
						this.selected.colorChangeSingle("hue", value);
					}
				}
				if (type === "saturation") {
					this._colorWheelElement.style.setProperty(
						"--displayS",
						`${value}%`
					);
					this.selected.colorChangeSingle("saturation", value);
				}
				if (type === "lightness") {
					if (value > 50) {
						this._colorWheelElement.style.setProperty(
							"--radialFirstOpacity",
							`${1}`
						);
						this._colorWheelElement.style.setProperty(
							"--radialSecondOpacity",
							`${(value - 50) / 50}`
						);
						this._colorWheelElement.style.setProperty(
							"--radialSecondLightness",
							`${100}%`
						);
					}
					if (value <= 50) {
						this._colorWheelElement.style.setProperty(
							"--radialFirstOpacity",
							`${0.5 + value / 100}`
						);
						this._colorWheelElement.style.setProperty(
							"--radialSecondOpacity",
							`${1 - value / 50}`
						);
						this._colorWheelElement.style.setProperty(
							"--radialSecondLightness",
							`${0}%`
						);
					}
					if (colorWheel.logging) {
						console.log(`Setting lightness to ${value}`);
					}

					this.selected.colorChangeSingle("lightness", value);
				}
			}
		} else {
			this.selected.colorChange(changeEvent.change.value);
		}
	}

	clicked(e: MouseEvent) {
		if (colorWheel.logging) {
			console.debug(e);
			console.debug(this._colorWheelElement.getBoundingClientRect());
			console.debug(this._colorWheelElement.clientWidth);
		}

		//Convert event into more useful format
		const click = this.mouseEventToCartCoords(e);

		//Loggging
		if (colorWheel.logging) {
			console.debug(e);
			console.info(
				`Wheel click at C(${click.x.toFixed(2)},${click.y.toFixed(2)})`
			);
		}

		this.selected.updatePosition(click);
	}

	mouseDown = (e: MouseEvent) => {
		//Convert event into more useful format
		const click = this.mouseEventToCartCoords(e);
		this.handles.some((handle) => {
			if (
				handle.radiusSquare <
				coordinateUtilities.cartDistanceSquare(handle.position, click)
			) {
				this.selected = handle;
				return true;
			}
		});
		e.preventDefault();
		this.isMouseDown = true;
		// this.selected.update(click);
		this.startPos = click;
		this.currentPos = click;
	};

	mouseMove = (e: MouseEvent) => {
		e.preventDefault();
		this.currentPos = this.mouseEventToCartCoords(e);
		if (this.isMouseDown && this.needRAF) {
			this.needRAF = false; // no need to call rAF up until next frame
			requestAnimationFrame(this.handleUpdate);
		}
	};
	mouseUp = (e: MouseEvent) => {
		e.preventDefault;

		this.isMouseDown = false;
		this.currentPos = this.mouseEventToCartCoords(e);
		requestAnimationFrame(this.handleUpdate);
	};

	handleUpdate = () => {
		this.needRAF = true;
		this.selected.updatePosition(this.currentPos);
	};

	mouseEventToCartCoords = (e: MouseEvent) => {
		return {
			x: e.clientX - this._circle.center.x,
			y: this._circle.center.y - e.clientY,
		};
	};

	resize() {
		if (colorWheel.logging) {
			console.info("Resizing Color Wheel");
		}
		this._circle = this.setUp();
		this.handles.forEach((element) => {
			element.resize(this._colorWheelElement, this._circle.radius);
		});
	}
}

export default colorWheel;
