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
	subComponents: subComponents[] = [];

	constructor(parentElement: HTMLElement) {
		//create and save unique identifier
		colorPickerComponent.componentCount += 1;
		this.id = colorPickerComponent.componentCount;

		this.component = document.createElement('div');
		this.component.classList.add(
			'colorPicker-component',
			'colorPicker-container',
			'm-fadeOut'
		);
		window.addEventListener('resize', this.resize.bind(this));

		//add Subcomponenets
		this.subComponents.push(new colorWheel(this.component));
		this.subComponents.push(new colorCircle(this.component));
		this.subComponents.push(new sliders(this.component, this.id));
		this.subComponents.push(new textInput(this.component));

		//#region testing
		//add temporary testing componenets
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

		const pre = document.createElement('button');
		pre.classList.add('colorPicker-pre');
		pre.append(this.component);

		document.onclick = (e) => {
			if (e.target instanceof HTMLElement) {
				if (e.target === pre) {
					this.component.classList.remove('m-fadeOut');
				} else {
					this.component.classList.add('m-fadeOut');
				}
			}
		};

		this.component.onclick = (e) => {
			e.stopPropagation();
			e.preventDefault();
		};

		parentElement.parentElement?.replaceChild(pre, parentElement);
		emitSelectedChange('new');
		// this.component.style.visibility = 'hidden';
	}

	//#region non constructor functions
	logState = (): void => {
		console.info('Logging State Of Component');
		console.info(this);
		this.subComponents.forEach((element) => {
			console.group(`Logging ${element.name}`);
			element.logState();
			console.groupEnd();
		});
		this.component.focus();
	};

	undebouncedResize = (): void => {
		console.debug('resize');
		resizeAlert.notify();
	};
	resize = debounce(this.undebouncedResize, 125);

	//#endregion non constructor functions
}

// class text extends subComponents{
// 	textWrapper: HTMLDivElement;
// 	constructor(parentElement: HTMLElement) {
// 		super()
// 		this.textWrapper = document.createElement('div');
// 		//

// 		parentElement.appendChild(this.textWrapper);
// 	}
// }

// class textInput{
// 	constructor(parentElement: HTMLElement){
// 		super()
// 	}
// }
