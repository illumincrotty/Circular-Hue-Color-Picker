import { Handle } from './handle';
import type { changeSource, colorChange } from './utilities/colorUtilities';
import type { State, subComponents } from './utilities/stateUtilities';
import { throttle } from './utilities/timingUtilities';
export { ColorWheel };

class ColorWheel implements subComponents {
	// #region class variables
	wheel: HTMLElement;
	children: Handle[] = [];
	touchEnabled = true;

	name = 'wheel' as changeSource;
	addColor!: HTMLButtonElement;
	remColor!: HTMLButtonElement;
	maxColors = 5;

	private selectedHandle = -1;

	// #endregion class variables

	constructor(parent: HTMLElement, private state: State) {
		this.wheel = document.createElement('div');
		this.wheel.classList.add('wheelStyle');

		state.subscribe(this);

		// #region event listeners
		// #region click listeners
		// Add event listeners
		this.wheel.addEventListener('mouseup', this.up);
		this.wheel.addEventListener('mouseleave', this.out);
		this.wheel.addEventListener('mousemove', this.moving);
		this.wheel.addEventListener('mousedown', this.down);

		this.wheel.addEventListener('click', this.click);

		this.addAndRemoveColorButton();
		// #endregion click listeners

		// #region touch listeners
		if (this.touchEnabled) {
			this.wheel.addEventListener('touchstart', this.down);
			this.wheel.addEventListener('touchmove', this.touchMoving);
			this.wheel.addEventListener('touchend', this.up);
		}
		// #endregion touch listeners
		// #endregion event listeners

		parent.appendChild(this.wheel);
	}

	addAndRemoveColorButton = (): void => {
		this.addColor = document.createElement('button');
		this.addColor.innerHTML = `<svg role="img" viewBox="0 0 24 24" style="fill-rule: evenodd; clip-rule: evenodd;"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12S0 18.623 0 12 5.377 0 12 0zm0 2.767c5.096 0 9.233 4.137 9.233 9.233 0 5.096-4.137 9.233-9.233 9.233-5.096 0-9.233-4.137-9.233-9.233 0-5.096 4.137-9.233 9.233-9.233z"></path><path d="M10.5 10.5V6.9a1.5 1.5 0 013 0v.01-.01 3.6h3.6a1.5 1.5 0 010 3h-.01.01-3.6v3.6a1.5 1.5 0 01-3 0v-.01.01-3.6H6.9a1.5 1.5 0 010-3h.01-.01 3.6z"></path></svg>`;
		this.addColor.classList.add('leftWheelButtonStyle');

		this.remColor = document.createElement('button');
		this.remColor.classList.add('rightWheelButtonStyle');
		this.remColor.innerHTML = `<svg role="img" viewBox="0 0 24 24" style="fill-rule: evenodd; clip-rule: evenodd;"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12S0 18.623 0 12 5.377 0 12 0zm0 2.767c5.096 0 9.233 4.137 9.233 9.233 0 5.096-4.137 9.233-9.233 9.233-5.096 0-9.233-4.137-9.233-9.233 0-5.096 4.137-9.233 9.233-9.233zM6.9 10.5h10.2c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5h-.01.01H6.9c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5h.01-.01z"></path></svg>`;
		this.remColor.disabled = true;

		this.wheel.appendChild(this.remColor);
		this.wheel.appendChild(this.addColor);
	};

	logState(): void {
		console.info('Logging state of Wheel');
		console.info(this);
		console.group('logging handles');
		console.info(this.children);
		console.groupEnd();
	}

	// #region event listener implementation
	private readonly down = (e: MouseEvent | TouchEvent) => {
		e.stopImmediatePropagation();

		// If add or remove button clicked, do nothing (handled in click method)
		if (e.target instanceof SVGElement) {
			return;
		}

		/* If the element clicked was not the wheel or the current handle,
		it must be another handle, so change handles */
		if (
			e.target !== this.wheel &&
			e.target !== this.children[this.selectedHandle].handle
		) {
			const newSelected = this.findHandle(e.target as HTMLElement);
			this.state.selected = newSelected;

			if (newSelected === -1) {
				console.error('Selected element Not found');
			}
		}

		this.children[this.selectedHandle].down(this.wheel, e);
	};

	private readonly up = () => {
		this.children[this.selectedHandle].up();
	};

	private readonly out = () => {
		if (this.children[this.selectedHandle].active) {
			this.children[this.selectedHandle].up();
		}
	};

	private readonly moving = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		this.children[this.selectedHandle].moving(e);
	};

	throttledMove = throttle(this.moving, 16);

	private readonly click = (e: MouseEvent) => {
		// If add or remove button is clicked
		if (
			e.target instanceof SVGElement ||
			e.target instanceof HTMLButtonElement
		) {
			const target = e.target.closest('button');

			if (target === this.addColor) {
				this.state.addColor();
				return;
			}

			if (target === this.remColor) {
				this.state.removeColor();
				return;
			}

			return;
		}

		this.children[this.selectedHandle].click(e);
	};

	private readonly touchMoving = (e: TouchEvent) => {
		e.preventDefault();
		this.children[this.selectedHandle].touchMoving(e);
	};
	// #endregion event listener implementation

	selectedChangeHandler(input: number | 'new' | 'delete'): void {
		if (typeof input === 'number') {
			if (input !== this.selectedHandle) {
				this.deselectHandle(this.selectedHandle);
				this.selectedHandle = input;
				this.selectHandle(input);
			}
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
		this.children.push(new Handle(this.wheel, this.children.length, this.state));
		if (this.children.length >= 2) {
			this.remColor.disabled = false;
		}

		if (this.children.length >= this.maxColors) {
			this.addColor.disabled = true;
		}
	}

	removeHandle(index: number): void {
		if (this.children.length > 1) {
			// Remove element from dom
			this.children[index]?.remove();

			// Remove from array
			this.children.splice(index, 1);

			// Decrement all following ID's
			this.children.slice(index).forEach((item) => {
				item.id -= 1;
			});

			if (this.children.length <= 1) {
				this.remColor.disabled = true;
			}

			if (this.children.length <= this.maxColors - 1) {
				this.addColor.disabled = false;
			}
		}
	}

	deselectHandle = (index: number): void => {
		console.debug(`deselecting handle #${index}`);
		if (this.children[this.selectedHandle] !== undefined) {
			this.children[index].deselect();

			// Reset Z index to creation order
			this.children[index].handle.style.zIndex =
				this.children[index].id.toString();
		}
	};

	selectHandle = (input: number): void => {
		console.debug(`selecting handle #${input}`);
		this.children[input].select();
		this.children[input].handle.style.zIndex = (
			this.children.length + 5
		).toString();
		return;
	};

	findHandle = (input: Handle | HTMLElement): number => {
		if (input instanceof Handle) {
			const selected = this.children.indexOf(input);
			return selected;
		}

		if (input instanceof HTMLElement) {
			const selected = this.children.reduce((value, current, index) => {
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
		if (this.selectedHandle >= 0) {
			this.children[this.selectedHandle].setDimensions(this.wheel);
		}

		if (change?.source !== 'wheel') {
			this.wheel.style.setProperty(
				'--wheelLightness',
				`${change.color.lightness}%`
			);

			this.children[this.selectedHandle].updateFromColor(change.color);
		}
	}

	resizeHandler(): void {
		this.children.forEach((element) => {
			element.setDimensions(this.wheel);
		});
	}

	maxColorChangeHandler(input: number): void {
		this.maxColors = input;
	}
}
