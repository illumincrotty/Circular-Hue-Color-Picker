import type { subComponents, State } from './utilities/stateUtilities';
import { ColorWheel } from './wheel';
import { Slider } from './slider';
import { debounce } from './utilities/timingUtilities';
import { TextInput } from './text';
import { ColorCircle } from './colorCircles';
import type { changeSource } from './utilities/colorUtilities';

export { ColorPickerComponent };

type pickerOptions = {
	standAlone?: boolean;
	width?: string;
	maxColors?: string;
	debug?: boolean;
};

class ColorPickerComponent implements subComponents {
	static componentCount = -1;

	name: changeSource = 'component';
	id: number;
	element: HTMLElement;
	children: subComponents[] = [];
	private visible = false;

	get width(): string {
		return this.element.style.getPropertyValue('--width');
	}

	set width(input: string) {
		this.element.style.setProperty('--width', input ?? '15rem');
		this.resizeHandler();
	}

	get hidden(): boolean {
		return this.visible;
	}

	set hidden(input: boolean) {
		if (input) {
			this.visible = false;
			this.element.classList.remove('appear');
		}

		if (!input) {
			this.visible = true;
			this.element.classList.add('appear');
		}
	}

	constructor(
		parentElement: HTMLElement | ShadowRoot,
		state: State,
		options?: pickerOptions
	) {
		// Create and save unique identifier
		ColorPickerComponent.componentCount += 1;
		this.id = ColorPickerComponent.componentCount;

		this.element = document.createElement('div');
		this.element.classList.add('container', 'componentStyle');
		this.element.tabIndex = -1;
		this.width = options?.width ?? '15rem';

		if (options?.standAlone ?? true) {
			this.hidden = false;
		}

		window.addEventListener('resize', debounce(state.resize, 125));

		void new Promise(() => {
			// Add Subcomponents
			this.children.push(new ColorWheel(this.element, state));
			this.children.push(new ColorCircle(this.element, state));
			this.children.push(new Slider(this.element, this.id, state));
			this.children.push(new TextInput(this.element, state));

			// #region testing
			// add temporary testing components
			if (options?.debug) {
				const addColorButton = document.createElement('button');
				addColorButton.classList.add('testingButtonStyle');
				addColorButton.textContent = 'Add';
				addColorButton.addEventListener('click', () => {
					state.addColor();
				});

				const remColorButton = document.createElement('button');
				remColorButton.classList.add('testingButtonStyle');
				remColorButton.textContent = 'Remove';
				remColorButton.addEventListener('click', () => state.removeColor());

				const stateLog = document.createElement('button');
				stateLog.classList.add('testingButtonStyle');
				stateLog.textContent = 'Log State';
				stateLog.addEventListener('mousedown', this.logState);

				this.element.appendChild(stateLog);
				this.element.appendChild(addColorButton);
				this.element.appendChild(remColorButton);
			}
			// #endregion testing

			parentElement.appendChild(this.element);
			state.subscribe(this);
			state.addColor();
			state.maxColors = parseInt(options?.maxColors ?? '5', 10);
			return;
		});

		this.element.onclick = (e) => {
			e.stopPropagation();
			e.preventDefault();
		};
	}

	// #region non constructor functions
	logState = (): void => {
		console.info('Logging State Of Component');
		console.info(this);
		this.children.forEach((element) => {
			if (element.name) {
				console.group(`Logging ${element.name}`);
				element.logState();
				console.groupEnd();
			} else {
				element.logState();
			}
		});
		this.element.focus();
	};

	undebouncedResize = (): void => {
		console.debug('resize');
	};

	resizeHandler = debounce(this.undebouncedResize, 125);

	// #endregion non constructor functions
}
