import {
	colorUtils as cu,
	timingUtils as tu,
	stateUtils as su,
} from './utilities.js';
import { handle } from './handle.js';
export { colorWheel };

class colorWheel extends su.subComponents {
	//#region class variables
	wheel: HTMLElement;
	private _selectedHandle = -1;
	public get selectedHandle() {
		return this._selectedHandle;
	}
	public set selectedHandle(value) {
		this._selectedHandle = value;
	}
	handles: handle[] = [];
	touchEnabled = false;
	dimensions = {
		radius: -1,
		x: -1,
		y: -1,
	};
	changeFunction: su.changeOrNum;
	name = 'wheel';

	//#endregion class variables

	constructor(parent: HTMLElement, createChange: su.changeOrNum) {
		super();
		this.wheel = document.createElement('div');
		this.wheel.classList.add('colorPicker-colorWheel');
		this.changeFunction = createChange;

		this.addHandle();

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
	logState() {
		console.info('Logging state of Wheel');
		console.info(this);
		console.group('logging handles');
		console.info(this.handles);
		console.groupEnd();
	}

	setDimensions(force?: boolean) {
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
		// console.debug(e.target);

		//if dimensions have not been set, set them
		this.setDimensions();

		/*if the element clicked was not the wheel or the current handle, 
		it must be another handle, so change handles*/
		if (
			e.target !== this.wheel &&
			e.target !== this.handles[this.selectedHandle].handle
		) {
			const newSelected = this.selectHandle(
				e.target as HTMLElement
			);

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
	throttledMove = tu.throttle(this.moving, 16);
	//#endregion event listener implementation

	addHandle() {
		this.handles.push(
			new handle(
				this.wheel,
				this.handles.length,
				this.changeFunction
			)
		);
		this.selectHandle(this.handles.length - 1);
	}

	/**
	 * Selects a handle and deselects the old handle
	 * @param newSelected the index, handle object or element to be selected
	 * @returns the index of the selected element or -1 if not found
	 */
	selectHandle = (
		newSelected: number | handle | HTMLElement
	): number => {
		//newSelected is an index
		if (typeof newSelected === 'number') {
			//newSelected is past the length of the list or is less than 0
			if (
				newSelected >= this.handles.length ||
				newSelected < 0
			) {
				return -1;
			}
			//if current selected handle is defined
			if (this.handles[this.selectedHandle] !== undefined) {
				this.handles[this.selectedHandle].deselect();

				//Reset Z index to creation order
				this.handles[
					this.selectedHandle
				].handle.style.zIndex = this.handles[
					this.selectedHandle
				].id.toString();
			}
			this.selectedHandle = newSelected;
			this.changeFunction(this.selectedHandle);
			this.handles[this.selectedHandle].select();
			this.handles[this.selectedHandle].handle.style.zIndex = (
				this.handles.length + 5
			).toString();
			return this.selectedHandle;
		}
		if (newSelected instanceof handle) {
			const selected = this.handles.indexOf(newSelected);
			if (selected !== -1) {
				return this.selectHandle(selected);
			}
			return -1;
		}
		if (newSelected instanceof HTMLElement) {
			const selected = this.handles.reduce(
				(value, current, index) => {
					if (current.handle === newSelected) {
						return index;
					}
					return value;
				},
				-1
			);
			if (selected !== -1) {
				return this.selectHandle(selected);
			}
			return selected;
		}

		console.error('Removed handle input was of an invalid type');
		return -1;
	};

	removeHandle(index: number) {
		if (this.handles.length > 1) {
			//remove element from dom
			this.handles[index].remove();

			//remove from array
			this.handles.splice(index, 1);

			//decrement all following ID's
			this.handles.slice(index).forEach((item) => {
				item.id -= 1;
			});

			//make most recently added element the selected handle/color
			this.selectHandle(this.handles.length - 1);
		}
	}

	update(change: cu.colorChange) {
		this.setDimensions();
		this.handles[this.selectedHandle].setDimensions(this.wheel);
		if (
			change.type == 'subtype' &&
			change.value.type == 'lightness'
		) {
			this.wheel.style.setProperty(
				'--lightness',
				`${change.value.value}%`
			);
		}

		if (change?.source !== 'wheel') {
			if (change.type == 'full') {
				this.wheel.style.setProperty(
					'--lightness',
					`${change.value.lightness}%`
				);
				this.handles[this.selectedHandle].updateFromColor(
					change.value
				);
			}
			if (change.type == 'subtype') {
				this.handles[
					this.selectedHandle
				].updateFromColorSubtype(change.value);
			}
		} else {
			// console.debug('change not from wheel');
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
