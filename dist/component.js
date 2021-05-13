import { emitSelectedChange, resizeAlert, } from './utilities/stateUtilities.js';
import { colorWheel } from './wheel.js';
import { sliders } from './slider.js';
import { debounce } from './utilities/timingUtilities.js';
import { textInput } from './text.js';
import { colorCircle } from './colorCircles.js';
export { colorPickerComponent };
class colorPickerComponent {
    constructor(parentElement) {
        var _a;
        this.name = 'component';
        this.subComponents = [];
        //#region non constructor functions
        this.logState = () => {
            console.info('Logging State Of Component');
            console.info(this);
            this.subComponents.forEach((element) => {
                console.group(`Logging ${element.name}`);
                element.logState();
                console.groupEnd();
            });
            this.component.focus();
        };
        this.undebouncedResize = () => {
            console.debug('resize');
            resizeAlert.notify();
        };
        this.resize = debounce(this.undebouncedResize, 125);
        //create and save unique identifier
        colorPickerComponent.componentCount += 1;
        this.id = colorPickerComponent.componentCount;
        this.component = document.createElement('div');
        this.component.classList.add('colorPicker-component', 'colorPicker-container', 'm-fadeOut');
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
            remColorButton.addEventListener('click', () => emitSelectedChange('delete'));
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
                }
                else {
                    this.component.classList.add('m-fadeOut');
                }
            }
        };
        this.component.onclick = (e) => {
            e.stopPropagation();
        };
        (_a = parentElement.parentElement) === null || _a === void 0 ? void 0 : _a.replaceChild(pre, parentElement);
        emitSelectedChange('new');
        // this.component.style.visibility = 'hidden';
    }
}
colorPickerComponent.componentCount = -1;
colorPickerComponent.debug = false;
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
