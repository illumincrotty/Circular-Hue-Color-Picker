import {
	colorChange,
	changeSource,
	hslColorToCssString,
} from './utilities/colorUtilities.js';
import {
	colorStateManger,
	emitSelectedChange,
	selectedStateManger,
	subComponents,
} from './utilities/stateUtilities.js';
export { colorCircle };

class colorCircle extends subComponents {
	name: changeSource = 'color-circle';
	selected = -1;
	wrapper: HTMLDivElement;
	circleList: HTMLButtonElement[] = [];

	constructor(parentElement: HTMLElement) {
		super();
		this.wrapper = document.createElement('div');
		this.wrapper.classList.add('colorPicker-container');
		this.wrapper.style.flexDirection = 'row';
		this.wrapper.style.flexWrap = 'wrap';
		this.wrapper.style.setProperty('--circle-Size', '2.3rem');

		this.addClickEventDelegation();
		colorStateManger.subscribe(this.colorChangeHandler);
		selectedStateManger.subscribe(this.selectedHandler);

		parentElement.appendChild(this.wrapper);
	}

	private addClickEventDelegation() {
		this.wrapper.addEventListener('click', (ev) => {
			if (ev.target !== this.wrapper) {
				this.circleList.forEach((element, index) => {
					const target = ev.target as HTMLButtonElement;
					if (target.closest('.colorPicker-circle') === element) {
						emitSelectedChange(index);
					}
				});
			}
		});
	}

	private addCircle = () => {
		const newCircle = document.createElement('button');
		newCircle.classList.add(
			'colorPicker-circle',
			'colorPicker-circle-dynamic'
		);
		this.circleList.push(newCircle);
		this.wrapper.append(newCircle);
		this.setSize();
		return;
	};

	private removeCircle = () => {
		this.circleList[this.selected].remove();
		this.setSize();
		if (this.circleList.length <= 6) {
			this.circleList[this.circleList.length - 1].style.display = 'block';
		}
		return this.circleList.splice(this.selected, 1);
	};

	private setSize = () => {
		// this.wrapper.style.setProperty(
		// 	'--circle-Size',
		// 	`${Math.max(2, 3 - (this.circleList.length - 1) / 3)}rem`
		// );
		return;
	};

	private deselect = (index: number) => {
		if (index >= 0 && index < this.circleList.length) {
			this.circleList[index].style.removeProperty('border-color');
		}
		return;
	};

	private select = (index: number) => {
		this.selected = index;
		this.circleList[this.selected].style.borderColor = 'var(--text-color)';
	};

	colorChangeHandler = (input: colorChange): void => {
		if (input.source !== this.name) {
			this.circleList[this.selected].style.setProperty(
				'--circle-color',
				hslColorToCssString(input.color)
			);
		}
	};
	selectedHandler = (input: number | 'new' | 'delete'): void => {
		if (input === 'new') {
			this.addCircle();
			return;
		}
		if (input === 'delete') {
			this.removeCircle();
			return;
		}
		if (input >= 0 && input < this.circleList.length) {
			this.deselect(this.selected);
			this.select(input);
		}
	};
	logState(): void {
		console.info(this);
		console.info(this.circleList);
	}
}
