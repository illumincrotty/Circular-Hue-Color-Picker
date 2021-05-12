import { handle } from './handle.js';
import { colorChange } from './utilities/colorUtilities.js';
import {
	colorStateManger,
	emitSelectedChange,
	resizeAlert,
	selectedStateManger,
	subComponents,
} from './utilities/stateUtilities.js';
import { throttle } from './utilities/timingUtilities.js';
export { colorWheel };

class colorWheel extends subComponents {
	//#region class variables
	wheel: HTMLElement;
	private selectedHandle = -1;
	handles: handle[] = [];
	touchEnabled = false;
	dimensions = {
		radius: -1,
		x: -1,
		y: -1,
	};
	name = 'wheel';

	//#endregion class variables

	constructor(parent: HTMLElement) {
		super();
		this.wheel = document.createElement('div');
		this.wheel.classList.add('colorPicker-colorWheel');

		selectedStateManger.subscribe(
			this.selectionHandler.bind(this)
		);
		colorStateManger.subscribe(
			this.colorChangeHandler.bind(this)
		);
		resizeAlert.subscribe(this.resize.bind(this));

		//#region event listeners
		//#region click listeners
		//Add event listeners
		this.wheel.addEventListener('mouseup', this.up);
		this.wheel.addEventListener('mouseleave', this.out);
		this.wheel.addEventListener('mousemove', this.moving);
		this.wheel.addEventListener('mousedown', this.down);

		this.wheel.addEventListener('click', this.click);
		//#endregion click listeners

		// #region touch listeners
		// if (this.touchEnabled) {
		// 	this.wheel.addEventListener('touchstart', this.down);
		// 	this.wheel.addEventListener('touchmove', this.touchMoving);
		// 	this.wheel.addEventListener('touchend', this.up);
		// }
		//#endregion touch listeners
		//#endregion event listeners

		parent.appendChild(this.wheel);
	}

	logState(): void {
		console.info('Logging state of Wheel');
		console.info(this);
		console.group('logging handles');
		console.info(this.handles);
		console.groupEnd();
	}

	setDimensions(force?: boolean): void {
		if (this.dimensions.radius === -1 || force) {
			this.dimensions.radius = this.wheel.clientWidth / 2;
			this.dimensions.x =
				this.dimensions.radius +
				this.wheel.clientLeft +
				this.wheel.offsetLeft;
			this.dimensions.y =
				this.dimensions.radius +
				this.wheel.clientTop +
				this.wheel.offsetTop;
			console.debug('Wheel Dimensions');
			console.debug(this.dimensions);
		}
	}

	//#region event listener implementation
	private down = (e: MouseEvent) => {
		//if dimensions have not been set, set them
		this.setDimensions();

		/*if the element clicked was not the wheel or the current handle, 
		it must be another handle, so change handles*/
		if (
			e.target !== this.wheel &&
			e.target !== this.handles[this.selectedHandle].handle
		) {
			const newSelected = this.findHandle(
				e.target as HTMLElement
			);
			emitSelectedChange(newSelected);

			if (newSelected === -1) {
				console.error('Selected element Not found');
			}
		}
		// console.debug(e);
		this.handles[this.selectedHandle].down(this.wheel);
	};

	private up = () => {
		this.handles[this.selectedHandle].up();
	};

	private out = () => {
		if (this.handles[this.selectedHandle].active) {
			this.handles[this.selectedHandle].up();
		}
	};

	private moving = (e: MouseEvent) => {
		this.handles[this.selectedHandle].moving(e);
	};

	private click = (e: MouseEvent) => {
		this.handles[this.selectedHandle].click(e);
	};
	// private touchMoving = (e: TouchEvent) => {
	// 	this.handles[this.selectedHandle].touchMoving(e);
	// };
	throttledMove = throttle(this.moving, 16);
	//#endregion event listener implementation

	selectionHandler(input: number | 'new' | 'delete'): void {
		if (typeof input === 'number') {
			this.deslectHandle(this.selectedHandle);
			this.selectedHandle = input;
			this.selectHandle(input);
		} else {
			if (input === 'new') {
				this.addHandle();
				return;
			}
			if (input === 'delete') {
				this.removeHandle(this.selectedHandle);
				return;
			}
		}
	}

	addHandle(): void {
		console.log('Adding Handle');
		this.handles.push(
			new handle(this.wheel, this.handles.length)
		);
	}

	removeHandle(index: number): void {
		if (this.handles.length > 1) {
			//remove element from dom
			this.handles[index]?.remove();

			//remove from array
			console.log(this.handles.splice(index, 1));

			//decrement all following ID's
			this.handles.slice(index).forEach((item) => {
				item.id -= 1;
			});
		}
	}

	deslectHandle = (index: number): void => {
		if (this.handles[this.selectedHandle] !== undefined) {
			this.handles[index].deselect();

			//Reset Z index to creation order
			this.handles[index].handle.style.zIndex =
				this.handles[index].id.toString();
		}
	};

	selectHandle = (input: number): void => {
		this.handles[input].select();
		this.handles[input].handle.style.zIndex = (
			this.handles.length + 5
		).toString();
		return;
	};

	findHandle = (input: handle | HTMLElement): number => {
		if (input instanceof handle) {
			const selected = this.handles.indexOf(input);
			return selected;
		}
		if (input instanceof HTMLElement) {
			const selected = this.handles.reduce(
				(value, current, index) => {
					if (current.handle === input) {
						return index;
					}
					return value;
				},
				-1
			);
			return selected;
		}
		return -1;
	};

	colorChangeHandler(change: colorChange): void {
		this.setDimensions();
		if (this.selectedHandle > 0) {
			this.handles[this.selectedHandle].setDimensions(
				this.wheel
			);
		}
		if (change?.source !== 'wheel') {
			this.wheel.style.setProperty(
				'--lightness',
				`${change.color.lightness}%`
			);

			this.handles[this.selectedHandle].updateFromColor(
				change.color
			);
		}
	}

	resize(): void {
		console.debug('Wheel Resize');
		this.setDimensions(true);
		this.handles.forEach((element) => {
			console.debug('Handle Resize');
			element.setDimensions(this.wheel, true);
		});
	}
}
