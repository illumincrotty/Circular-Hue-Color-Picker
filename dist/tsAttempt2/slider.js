import { stateUtils as su } from './utilities.js';
export { sliders };
class sliders extends su.subComponents {
    constructor(parentElement, changeFunctions) {
        super();
        this.name = 'slider';
        this.createRanges = () => {
            this.ranges = {
                hue: new range(this.sliderWrapper, { name: 'hue', min: 0, max: 360, default: 0 }, this.changeFunction),
                saturation: new range(this.sliderWrapper, { name: 'saturation', min: 0, max: 100, default: 0 }, this.changeFunction),
                lightness: new range(this.sliderWrapper, { name: 'lightness', min: 0, max: 100, default: 50 }, this.changeFunction),
            };
        };
        this.changeFunction = changeFunctions;
        this.sliderWrapper = document.createElement('div');
        this.sliderWrapper.classList.add('colorPicker-container', 'colorPicker-component');
        parentElement.appendChild(this.sliderWrapper);
        this.createRanges();
    }
    update(change) {
        if (change.source !== undefined &&
            change.source !== 'slider') {
            if (change.type === 'full') {
                this.ranges.hue.update(change.value.hue);
                this.ranges.saturation.update(change.value.saturation);
                this.ranges.lightness.update(change.value.lightness);
                return;
            }
            if (change.type === 'subtype') {
                if (change.value.type === 'hue') {
                    this.ranges.hue.update(change.value.value);
                    return;
                }
                if (change.value.type === 'saturation') {
                    this.ranges.saturation.update(change.value.value);
                    return;
                }
                if (change.value.type === 'lightness') {
                    this.ranges.lightness.update(change.value.value);
                    return;
                }
                console.error(`Invalid change subtype submitted to slider`);
                console.error(change);
            }
            console.error(`Invalid change type submitted to slider`);
            console.error(change);
        }
    }
    logState() {
        console.info(this);
        console.group('ranges');
        console.info(this.ranges);
        console.groupEnd();
    }
    resize() { }
}
class range {
    constructor(parentElement, options, changeFunction) {
        // createInput = ():HTMLInputElement=>{
        // }
        this.reset = () => {
            this.input.value = this.default.toString();
        };
        this.default = options.default;
        const wrapper = document.createElement('div');
        wrapper.style.width = '90%';
        wrapper.style.marginBottom = '5%';
        const label = document.createElement('label');
        const capitalLabel = options.name[0].toUpperCase() + options.name.slice(1);
        label.textContent = capitalLabel;
        label.style.marginRight = '100%';
        wrapper.appendChild(label);
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'range');
        this.input.setAttribute('min', `${options.min}`);
        this.input.setAttribute('max', `${options.max}`);
        this.input.setAttribute('value', `${options.default}`);
        this.input.style.width = '100%';
        this.input.addEventListener('input', () => {
            changeFunction({
                type: 'subtype',
                value: {
                    type: options.name,
                    value: parseFloat(this.input.value),
                },
            });
        });
        wrapper.appendChild(this.input);
        parentElement.appendChild(wrapper);
    }
    update(change) {
        this.input.value = change.toString();
    }
}
