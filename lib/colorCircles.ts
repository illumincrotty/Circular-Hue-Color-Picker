import { colorCircleBase, colorCircleDynamicStyle, container, theme } from './style/cpStyle.css';
import type { changeSource, colorChange } from './utilities/colorUtilities';
import { hslColorToCssString } from './utilities/colorUtilities';
import type { State, subComponents } from './utilities/stateUtilities';
export { ColorCircle };

class ColorCircle implements subComponents {
	name: changeSource = 'color-circle';
	selected = -1;
	wrapper: HTMLDivElement;
	circleList: HTMLButtonElement[] = [];

	constructor(parentElement: HTMLElement, private state: State) {
		this.wrapper = document.createElement('div');
		this.wrapper.classList.add(`${container}`);
		this.wrapper.style.flexDirection = 'row';
		this.wrapper.style.width = '100%';
		this.wrapper.style.flexWrap = 'wrap';

		this.addClickEventDelegation();

		state.subscribe(this);
		parentElement.appendChild(this.wrapper);
	}

	private readonly addClickEventDelegation = () => {
		this.wrapper.addEventListener('click', (ev) => {
			if (ev.target !== this.wrapper) {
				this.circleList.forEach((element, index) => {
					const target = ev.target as HTMLButtonElement;
					if (target.closest('button') === element) {
						this.state.selected = index;
					}
				});
			}
		});
	};

	private readonly addCircle = () => {
		const newCircle = document.createElement('button');
		newCircle.classList.add(`${colorCircleBase}`, `${colorCircleDynamicStyle}`);
		this.circleList.push(newCircle);
		this.wrapper.append(newCircle);
		return;
	};

	private readonly removeCircle = () => {
		this.circleList[this.selected].remove();
		if (this.circleList.length <= 6) {
			this.circleList[this.circleList.length - 1].style.display = 'block';
		}

		return this.circleList.splice(this.selected, 1);
	};

	private readonly deselect = (index: number) => {
		if (index >= 0 && index < this.circleList.length) {
			this.circleList[index].style.borderColor = `${theme.secondary}`;
		}

		return;
	};

	private readonly select = (index: number) => {
		this.selected = index;
		this.circleList[this.selected].style.borderColor = `${theme.text}`;
	};

	colorChangeHandler = (input: colorChange): void => {
		if (input.source !== this.name) {
			this.circleList[this.selected].style.setProperty(
				'--circle-color',
				hslColorToCssString(input.color)
			);
		}
	};

	selectedChangeHandler = (input: number | 'new' | 'delete'): void => {
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
