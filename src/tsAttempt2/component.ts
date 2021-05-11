import { subComponents } from './utilities/stateUtilities.js';
import {
	colorChange,
	colorCopy,
	defaultColor,
	hsl_color,
} from './utilities/colorUtilities.js';
import { colorWheel } from './wheel.js';
import { sliders } from './slider.js';
import { throttle } from './utilities/timingUtilities.js';
export { colorPickerComponent };

class colorPickerComponent extends subComponents {
	static componentCount = -1;

	name = 'component';
	selectedColorIndex = -1;
	colors: hsl_color[] = [];
	changes: (colorChange | undefined)[] = [];
	id: number;
	component: HTMLElement;
	subComponents: subComponents[] = [];
	wheel: colorWheel;

	constructor(parentElement: HTMLElement) {
		super();

		//create and save unique identifier
		colorPickerComponent.componentCount += 1;
		this.id = colorPickerComponent.componentCount;

		this.addColor();

		this.component = document.createElement('div');
		this.component.classList.add(
			'colorPicker-component',
			'colorPicker-container'
		);
		parentElement.appendChild(this.component);
		window.addEventListener('resize', this.resize.bind(this));

		//add Subcomponenets
		this.wheel = new colorWheel(
			this.component,
			this.changeFunction
		);
		this.subComponents.push(this.wheel);
		this.subComponents.push(
			new sliders(this.component, this.changeFunction)
		);

		//#region testing
		//add temporary testing componenets
		const addColorButton = document.createElement('button');
		addColorButton.textContent = 'Add';
		addColorButton.addEventListener('click', () => {
			this.addColor();
		});

		const remColorButton = document.createElement('button');
		remColorButton.textContent = 'Remove';
		remColorButton.addEventListener('click', () => {
			this.removeColor();
		});
		const stateLog = document.createElement('button');
		stateLog.textContent = 'Log State';
		stateLog.addEventListener('click', this.logState);

		this.component.appendChild(stateLog);
		this.component.appendChild(addColorButton);
		this.component.appendChild(remColorButton);
		// this.text = new text(this.component);
		//#endregion testing
	}
	//#region non constructor functions
	logState = (): void => {
		console.info('Logging State Of Component');
		console.info(this);
		console.info(
			`Selected color index: ${this.selectedColorIndex}`
		);
		this.subComponents.forEach((element) => {
			console.group(`Logging ${element.name}`);
			element.logState();
			console.groupEnd();
		});
	};

	addColor = (): void => {
		this.selectedColorIndex =
			this.colors.push(defaultColor()) - 1;
		this.colors[this.selectedColorIndex];
		this.changes.push(undefined);
		if (this.wheel) {
			this.wheel.addHandle();
		}
		this.changes[this.selectedColorIndex] = {
			type: 'full',
			value: defaultColor(),
		};
		this.update();
	};
	removeColor = (): void => {
		if (this.colors.length > 1) {
			this.colors.splice(this.selectedColorIndex, 1);
			this.wheel.removeHandle(this.selectedColorIndex);
			this.selectedColorIndex = this.colors.length - 1;
			this.update();
			return;
		}
		console.warn('Attempting to remove only color');
	};
	selectColor = (index: number): void => {
		if (index < this.colors.length) {
			this.selectedColorIndex = index;
			this.changes[this.selectedColorIndex] = {
				type: 'full',
				value: this.colors[this.selectedColorIndex],
				source: 'component',
			};
			this.update();
			return;
		}
		console.error('Invalid index selected');
	};

	changeFunction = (inputChange: colorChange | number): void => {
		//the input change is which color is selected
		if (typeof inputChange === 'number') {
			this.selectColor(inputChange);
			return;
		}
		//the input change is a full color change OR it is currently undefined
		// then the input change overrides whatever the current change is
		if (
			this.changes[this.selectedColorIndex] == undefined ||
			inputChange.type == 'full'
		) {
			this.changes[this.selectedColorIndex] = inputChange;
			this.update();
			return;
		}
		const currentChange = this.changes[
			this.selectedColorIndex
		] as colorChange;

		if (currentChange.type == 'full') {
			currentChange['value'][inputChange.value.type] =
				inputChange.value.value;
			this.update();
			return;
		}
		if (currentChange.type == 'subtype') {
			if (currentChange.value.type == inputChange.value.type) {
				currentChange.value.value = inputChange.value.value;
				this.update();
				return;
			}
			const copy: hsl_color = colorCopy(
				this.colors[this.selectedColorIndex]
			);
			copy[currentChange.value.type] =
				currentChange.value.value;
			copy[inputChange.value.type] = inputChange.value.value;
			this.changes[this.selectedColorIndex] = {
				type: 'full',
				value: copy,
				source: 'component',
			};
			this.update();
			return;
		}

		throw new Error(
			'theoretically unreachable part of createChange function'
		);
	};

	unThrottledupdate = (): void => {
		const change = this.changes[this.selectedColorIndex];
		if (change !== undefined) {
			if (change.type === 'full') {
				this.colors[this.selectedColorIndex] = change.value;
			}
			if (change.type === 'subtype') {
				this.colors[this.selectedColorIndex][
					change.value.type
				] = change.value.value;
			}
			this.colors[this.selectedColorIndex];
			this.subComponents.forEach((subcomponent) => {
				subcomponent.update(change);
			});
			this.changes[this.selectedColorIndex] = undefined;
		}
	};

	update = throttle(this.unThrottledupdate.bind(this), 16);
	resize = (): void => {
		console.debug('resize');
		this.subComponents.forEach((element) => {
			element.resize();
		});
	};
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
