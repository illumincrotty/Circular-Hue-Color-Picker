import { emitSelectedChange, resizeAlert, } from './utilities/stateUtilities.js';
import { colorWheel } from './wheel.js';
import { sliders } from './slider.js';
import { debounce } from './utilities/timingUtilities.js';
import { textInput } from './text.js';
export { colorPickerComponent };
class colorPickerComponent {
    constructor(parentElement) {
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
        this.component.classList.add('colorPicker-component', 'colorPicker-container');
        window.addEventListener('resize', this.resize.bind(this));
        //add Subcomponenets
        this.subComponents.push(new colorWheel(this.component));
        this.subComponents.push(new sliders(this.component, this.id));
        this.subComponents.push(new textInput(this.component));
        //#region testing
        //add temporary testing componenets
        const addColorButton = document.createElement('button');
        addColorButton.textContent = 'Add';
        addColorButton.addEventListener('click', () => {
            emitSelectedChange('new');
        });
        const remColorButton = document.createElement('button');
        remColorButton.textContent = 'Remove';
        remColorButton.addEventListener('click', () => {
            emitSelectedChange('delete');
        });
        const stateLog = document.createElement('button');
        stateLog.textContent = 'Log State';
        stateLog.addEventListener('click', this.logState);
        this.component.appendChild(stateLog);
        this.component.appendChild(addColorButton);
        this.component.appendChild(remColorButton);
        // this.text = new text(this.component);
        //#endregion testing
        parentElement.appendChild(this.component);
        emitSelectedChange('new');
        while (this.component.clientWidth < 20) {
            this.resize();
        }
    }
}
colorPickerComponent.componentCount = -1;
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
