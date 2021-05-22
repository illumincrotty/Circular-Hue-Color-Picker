import { handle } from './handle.js';
import type { changeSource, colorChange } from './utilities/colorUtilities.js';
import {
	colorStateManger,
	emitSelectedChange,
	numberOfColorsAlert,
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
	touchEnabled = true;
	dimensions = {
		radius: -1,
		x: -1,
		y: -1,
	};
	name = 'wheel' as changeSource;
	addColor!: HTMLButtonElement;
	remColor!: HTMLButtonElement;
	maxColors = 5;

	//#endregion class variables

	constructor(parent: HTMLElement) {
		super();
		this.wheel = document.createElement('div');
		this.wheel.classList.add('colorPicker-colorWheel');

		selectedStateManger.subscribe(this.selectionHandler.bind(this));
		colorStateManger.subscribe(this.colorChangeHandler.bind(this));
		resizeAlert.subscribe(this.resize.bind(this));
		numberOfColorsAlert.subscribe(this.maxHandler.bind(this));

		//#region event listeners
		//#region click listeners
		//Add event listeners
		this.wheel.addEventListener('mouseup', this.up);
		this.wheel.addEventListener('mouseleave', this.out);
		this.wheel.addEventListener('mousemove', this.moving);
		this.wheel.addEventListener('mousedown', this.down);

		this.wheel.addEventListener('click', this.click);

		this.addAndRemoveColorButton();
		//#endregion click listeners

		// #region touch listeners
		if (this.touchEnabled) {
			this.wheel.addEventListener('touchstart', this.down);
			this.wheel.addEventListener('touchmove', this.touchMoving);
			this.wheel.addEventListener('touchend', this.up);
		}
		//#endregion touch listeners
		//#endregion event listeners

		parent.appendChild(this.wheel);
	}

	addAndRemoveColorButton = (): void => {
		this.addColor = document.createElement('button');
		this.addColor.classList.add(
			'colorPicker-circle',
			'colorPicker-svg-button-wrap',
			'colorPicker-wheel-button'
		);
		const svgAdd = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		);
		svgAdd.setAttribute('role', 'img');
		svgAdd.setAttribute('viewBox', '0 0 24 24');
		svgAdd.style.fillRule = 'evenodd';
		svgAdd.style.clipRule = 'evenodd';
		svgAdd.classList.add('colorPicker-svg-button');
		svgAdd.innerHTML = `<path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12S0 18.623 0 12 5.377 0 12 0zm0 2.767c5.096 0 9.233 4.137 9.233 9.233 0 5.096-4.137 9.233-9.233 9.233-5.096 0-9.233-4.137-9.233-9.233 0-5.096 4.137-9.233 9.233-9.233z"/><path d="M10.5 10.5V6.9a1.5 1.5 0 013 0v.01-.01 3.6h3.6a1.5 1.5 0 010 3h-.01.01-3.6v3.6a1.5 1.5 0 01-3 0v-.01.01-3.6H6.9a1.5 1.5 0 010-3h.01-.01 3.6z"/>`;
		this.addColor.append(svgAdd);
		this.addColor.style.right = '0';

		this.remColor = document.createElement('button');
		this.remColor.classList.add(
			'colorPicker-circle',
			'colorPicker-svg-button-wrap',
			'colorPicker-wheel-button'
		);
		const svgRemove = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg'
		);
		svgRemove.setAttribute('role', 'img');
		svgRemove.setAttribute('viewBox', '0 0 24 24');
		svgRemove.style.fillRule = 'evenodd';
		svgRemove.style.clipRule = 'evenodd';
		svgRemove.classList.add('colorPicker-svg-button');
		svgRemove.innerHTML = `<path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12S0 18.623 0 12 5.377 0 12 0zm0 2.767c5.096 0 9.233 4.137 9.233 9.233 0 5.096-4.137 9.233-9.233 9.233-5.096 0-9.233-4.137-9.233-9.233 0-5.096 4.137-9.233 9.233-9.233zM6.9 10.5h10.2c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5h-.01.01H6.9c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5h.01-.01z"/>`;
		this.remColor.append(svgRemove);
		this.remColor.style.left = '0';
		this.remColor.style.transform = 'translate(-25%,25%)';
		this.remColor.disabled = true;

		this.wheel.prepend(this.remColor);
		this.wheel.appendChild(this.addColor);
	};

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
		}
	}

	//#region event listener implementation
	private down = (e: MouseEvent | TouchEvent) => {
		e.stopImmediatePropagation();

		//if dimensions have not been set, set them
		this.setDimensions();

		//If add or remove button clicked, do nothing (handled in click method)
		if (
			e.target instanceof SVGElement ||
			e.target instanceof HTMLButtonElement
		) {
			return;
		}

		/*if the element clicked was not the wheel or the current handle, 
		it must be another handle, so change handles*/
		if (
			e.target !== this.wheel &&
			e.target !== this.handles[this.selectedHandle].handle
		) {
			const newSelected = this.findHandle(e.target as HTMLElement);
			emitSelectedChange(newSelected);

			if (newSelected === -1) {
				console.error('Selected element Not found');
			}
		}
		// console.debug(e);
		this.handles[this.selectedHandle].down(this.wheel, e);
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
		e.preventDefault();
		e.stopPropagation();
		this.handles[this.selectedHandle].moving(e);
	};
	throttledMove = throttle(this.moving, 16);

	private click = (e: MouseEvent) => {
		//if add or remove button is clicked
		if (
			e.target instanceof SVGElement ||
			e.target instanceof HTMLButtonElement
		) {
			const target = e.target.closest('.colorPicker-circle');

			if (target === this.addColor) {
				emitSelectedChange('new');
				return;
			}
			if (target === this.remColor) {
				emitSelectedChange('delete');
				return;
			}
			return;
		}
		this.handles[this.selectedHandle].click(e);
		e.preventDefault();
		e.stopImmediatePropagation();
	};
	private touchMoving = (e: TouchEvent) => {
		this.handles[this.selectedHandle].touchMoving(e);
	};
	//#endregion event listener implementation

	selectionHandler(input: number | 'new' | 'delete'): void {
		if (typeof input === 'number') {
			this.deselectHandle(this.selectedHandle);
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
		this.handles.push(new handle(this.wheel, this.handles.length));
		if (this.handles.length >= 2) {
			this.remColor.disabled = false;
		}
		if (this.handles.length >= this.maxColors) {
			this.addColor.disabled = true;
		}
	}

	removeHandle(index: number): void {
		if (this.handles.length > 1) {
			//remove element from dom
			this.handles[index]?.remove();

			//remove from array
			this.handles.splice(index, 1);

			//decrement all following ID's
			this.handles.slice(index).forEach((item) => {
				item.id -= 1;
			});

			if (this.handles.length <= 1) {
				this.remColor.disabled = true;
			}
			if (this.handles.length <= this.maxColors - 1) {
				this.addColor.disabled = false;
			}
		}
	}

	deselectHandle = (index: number): void => {
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
			const selected = this.handles.reduce((value, current, index) => {
				if (current.handle === input) {
					return index;
				}
				return value;
			}, -1);
			return selected;
		}
		return -1;
	};

	colorChangeHandler(change: colorChange): void {
		this.setDimensions();
		if (this.selectedHandle >= 0) {
			this.handles[this.selectedHandle].setDimensions(
				this.wheel,
				this.handles[this.selectedHandle].dimensions.functionalRad < 1
			);
		}
		if (change?.source !== 'wheel') {
			this.wheel.style.setProperty(
				'--lightness',
				`${change.color.lightness}%`
			);

			this.handles[this.selectedHandle].updateFromColor(change.color);
		}
	}

	resize(): void {
		this.setDimensions(true);
		this.handles.forEach((element) => {
			// console.debug('Handle Resize');
			element.setDimensions(this.wheel, true);
		});
	}

	maxHandler(input: number): void {
		this.maxColors = input;
	}
}
