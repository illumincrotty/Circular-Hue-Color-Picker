import { hslColorToCssString, } from './utilities/colorUtilities.js';
import { colorStateManger, emitSelectedChange, selectedStateManger, subComponents, } from './utilities/stateUtilities.js';
export { colorCircle };
class colorCircle extends subComponents {
    constructor(parentElement) {
        super();
        this.name = 'color-circle';
        this.selected = -1;
        this.circleList = [];
        this.addCircle = () => {
            const newCircle = document.createElement('button');
            newCircle.classList.add('colorPicker-circle', 'colorPicker-circle-dynamic');
            this.circleList.push(newCircle);
            this.wrapper.append(newCircle);
            this.setSize();
            return;
        };
        this.removeCircle = () => {
            this.circleList[this.selected].remove();
            this.setSize();
            if (this.circleList.length <= 6) {
                this.circleList[this.circleList.length - 1].style.display = 'block';
            }
            return this.circleList.splice(this.selected, 1);
        };
        this.setSize = () => {
            // this.wrapper.style.setProperty(
            // 	'--circle-Size',
            // 	`${Math.max(2, 3 - (this.circleList.length - 1) / 3)}rem`
            // );
            return;
        };
        this.deselect = (index) => {
            if (index >= 0 && index < this.circleList.length) {
                this.circleList[index].style.borderColor = 'var(--Secondary)';
            }
            return;
        };
        this.select = (index) => {
            this.selected = index;
            this.circleList[this.selected].style.borderColor = 'var(--text-color)';
        };
        this.colorChangeHandler = (input) => {
            if (input.source !== this.name) {
                this.circleList[this.selected].style.setProperty('--circle-color', hslColorToCssString(input.color));
            }
        };
        this.selectedHandler = (input) => {
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
    addClickEventDelegation() {
        this.wrapper.addEventListener('click', (ev) => {
            if (ev.target !== this.wrapper) {
                this.circleList.forEach((element, index) => {
                    const target = ev.target;
                    if (target.closest('.colorPicker-circle') === element) {
                        emitSelectedChange(index);
                    }
                });
            }
        });
    }
    logState() {
        console.info(this);
        console.info(this.circleList);
    }
}
