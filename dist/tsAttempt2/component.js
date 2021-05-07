import { colorUtils as cu, timingUtils as tu, stateUtils as su, } from './utilities.js';
import { colorWheel } from './wheel.js';
export { colorPickerComponent };
class colorPickerComponent extends su.subComponents {
    constructor(element) {
        super();
        this.name = 'component';
        this.selectedColorIndex = -1;
        this.colors = [];
        this.changes = [];
        this.subComponents = [];
        this.logState = () => {
            console.info('Logging State Of Component');
            console.info(this);
            console.info(`Selected color index: ${this.selectedColorIndex}`);
            this.subComponents.forEach((element) => {
                console.group(`Logging ${element.name}`);
                element.logState();
                console.groupEnd();
            });
        };
        this.addColor = () => {
            this.colors.push(this.defaultColor());
            this.selectedColorIndex = this.colors.length - 1;
            this.colors[this.selectedColorIndex];
            this.changes.push(undefined);
            if (this.wheel) {
                this.wheel.addHandle();
            }
        };
        this.removeColor = () => {
            if (this.colors.length > 1) {
                this.colors.splice(this.selectedColorIndex, 1);
                this.wheel.removeHandle(this.selectedColorIndex);
                this.selectedColorIndex = this.colors.length - 1;
                return;
            }
            console.warn('Attempting to remove only color');
        };
        this.selectColor = (index) => {
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
        this.changeFunction = (inputChange) => {
            //the input change is which color is selected
            if (typeof inputChange === 'number') {
                this.selectColor(inputChange);
                return;
            }
            //the input change is a full color change OR it is currently undefined
            // then the input change overrides whatever the current change is
            if (this.changes[this.selectedColorIndex] == undefined ||
                inputChange.type == 'full') {
                this.changes[this.selectedColorIndex] = inputChange;
                this.update();
                return;
            }
            const currentChange = this.changes[this.selectedColorIndex];
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
                const copy = cu.colorCopy(this.colors[this.selectedColorIndex]);
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
            throw new Error('theoretically unreachable part of createChange function');
        };
        this.defaultColor = () => {
            return { hue: 0, saturation: 0, lightness: 50 };
        };
        this.unThrottledupdate = () => {
            const change = this.changes[this.selectedColorIndex];
            if (change !== undefined) {
                if (change.type === 'full') {
                    this.colors[this.selectedColorIndex] = change.value;
                }
                if (change.type === 'subtype') {
                    this.colors[this.selectedColorIndex][change.value.type] = change.value.value;
                }
                this.colors[this.selectedColorIndex];
                this.subComponents.forEach((subcomponent) => {
                    subcomponent.update(change);
                });
                this.changes[this.selectedColorIndex] = undefined;
            }
        };
        this.update = tu.throttle(this.unThrottledupdate.bind(this), 16);
        this.resize = () => {
            this.subComponents.forEach((element) => {
                element.resize();
            });
        };
        this.addColor();
        // const frag = document.createDocumentFragment();
        this.component = document.createElement('div');
        this.component.classList.add('colorPicker-component', 'colorPicker-container');
        element.appendChild(this.component);
        //add Subcomponenets
        this.wheel = new colorWheel(this.component, this.changeFunction);
        this.subComponents.push(this.wheel);
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
    }
}
// class sliders extends su.subComponents{}
// class range{}
// class text extends su.subComponents{
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
