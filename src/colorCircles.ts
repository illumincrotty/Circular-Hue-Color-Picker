import { colorChange, changeSource } from './utilities/colorUtilities';
import { subComponents } from './utilities/stateUtilities';

class colorCircle extends subComponents {
	name: changeSource = 'color-circle';
	constructor(parentElement: HTMLElement) {
		super();
		const wrapper = document.createElement('div');
		wrapper.classList.add('.colorPicker-container');
		wrapper.style.flexDirection = 'row';
	}

	addCircle = () => {
		const newCircle = document.createElement('div');
		newCircle.classList.add('cir');
	};

	colorChangeHandler(input: colorChange): void {
		throw new Error('Method not implemented.');
	}
	logState(): void {
		throw new Error('Method not implemented.');
	}
}
