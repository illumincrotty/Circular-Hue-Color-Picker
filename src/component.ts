import {
	emitSelectedChange,
	resizeAlert,
	subComponents,
} from './utilities/stateUtilities.js';
import { colorWheel } from './wheel.js';
import { sliders } from './slider.js';
import { debounce } from './utilities/timingUtilities.js';
import { textInput } from './text.js';
import { colorCircle } from './colorCircles.js';
export { colorPickerComponent };

class colorPickerComponent {
	static componentCount = -1;
	static debug = false;

	name = 'component';
	id: number;
	component: HTMLElement;
	subcomponents: subComponents[] = [];

	constructor(
		parentElement: HTMLElement,
		initiallyVisible: boolean,
		width: string
	) {
		//create and save unique identifier
		colorPickerComponent.componentCount += 1;
		this.id = colorPickerComponent.componentCount;

		this.component = document.createElement('div');
		this.component.classList.add(
			'colorPicker-component',
			'colorPicker-container'
		);
		this.component.style.setProperty('--colorPicker-width', width);
		if (!initiallyVisible) {
			this.component.classList.add('m-fadeOut');
		}

		window.addEventListener('resize', this.resize.bind(this));

		//add Subcomponents
		this.subcomponents.push(new colorWheel(this.component));
		this.subcomponents.push(new colorCircle(this.component));
		this.subcomponents.push(new sliders(this.component, this.id));
		this.subcomponents.push(new textInput(this.component));

		//#region testing
		//add temporary testing components
		if (colorPickerComponent.debug) {
			const addColorButton = document.createElement('button');
			addColorButton.classList.add('colorPicker-testing-button');
			addColorButton.textContent = 'Add';
			addColorButton.addEventListener('click', () => {
				emitSelectedChange('new');
			});

			const remColorButton = document.createElement('button');
			remColorButton.classList.add('colorPicker-testing-button');
			remColorButton.textContent = 'Remove';
			remColorButton.addEventListener('click', () =>
				emitSelectedChange('delete')
			);

			const stateLog = document.createElement('button');
			stateLog.classList.add('colorPicker-testing-button');
			stateLog.textContent = 'Log State';
			stateLog.addEventListener('mousedown', this.logState);

			this.component.appendChild(stateLog);
			this.component.appendChild(addColorButton);
			this.component.appendChild(remColorButton);
		}
		//#endregion testing

		this.component.onclick = (e) => {
			e.stopPropagation();
			e.preventDefault();
		};

		parentElement.appendChild(this.component);
		emitSelectedChange('new');
	}

	//#region non constructor functions
	logState = (): void => {
		console.info('Logging State Of Component');
		console.info(this);
		this.subcomponents.forEach((element) => {
			console.group(`Logging ${element.name}`);
			element.logState();
			console.groupEnd();
		});
		this.component.focus();
	};

	visibility = (val: boolean) => {
		if (val) {
			this.component.classList.remove('m-fadeOut');
		} else {
			this.component.classList.add('m-fadeOut');
		}
	};

	undebouncedResize = (): void => {
		console.debug('resize');
		resizeAlert.notify();
	};
	resize = debounce(this.undebouncedResize, 125);

	//#endregion non constructor functions
}
