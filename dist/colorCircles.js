import { subComponents } from './utilities/stateUtilities';
class colorCircle extends subComponents {
    constructor(parentElement) {
        super();
        this.name = 'color-circle';
        this.addCircle = () => {
            const newCircle = document.createElement('div');
            newCircle.classList.add('cir');
        };
        const wrapper = document.createElement('div');
        wrapper.classList.add('.colorPicker-container');
        wrapper.style.flexDirection = 'row';
    }
    colorChangeHandler(input) {
        throw new Error('Method not implemented.');
    }
    logState() {
        throw new Error('Method not implemented.');
    }
}
