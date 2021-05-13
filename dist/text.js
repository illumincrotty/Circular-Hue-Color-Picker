import { defaultColor, } from './utilities/colorUtilities.js';
import { colorStateManger, emitColorChange, subComponents, } from './utilities/stateUtilities.js';
export { textInput };
class textInput extends subComponents {
    constructor(parentElement) {
        super();
        this.createNumberInput = (options) => {
            var _a, _b, _c, _d;
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('pattern', '[0-9]*');
            input.setAttribute('min', `${(_a = options === null || options === void 0 ? void 0 : options.min) !== null && _a !== void 0 ? _a : 0}`);
            input.setAttribute('max', `${(_b = options === null || options === void 0 ? void 0 : options.max) !== null && _b !== void 0 ? _b : 100}`);
            input.setAttribute('step', `${(_c = options === null || options === void 0 ? void 0 : options.step) !== null && _c !== void 0 ? _c : 1}`);
            input.setAttribute('placeholder', `${(_d = options === null || options === void 0 ? void 0 : options.placeholder) !== null && _d !== void 0 ? _d : 50}`);
            input.classList.add('colorPicker-number-input');
            return input;
        };
        this.name = 'text';
        this.numberInputs = {
            hue: this.createNumberInput({
                max: 360,
                placeholder: defaultColor().hue,
            }),
            saturation: this.createNumberInput({
                placeholder: defaultColor().saturation,
            }),
            lightness: this.createNumberInput({
                placeholder: defaultColor().lightness,
            }),
        };
        this.fullSpan = document.createElement('div');
        this.fullSpan.classList.add('colorPicker-text-wrapper');
        this.fullSpan.append(document.createTextNode('hsl('));
        this.fullSpan.append(this.numberInputs.hue);
        this.fullSpan.append(document.createTextNode(','));
        this.fullSpan.append(this.numberInputs.saturation);
        this.fullSpan.append(document.createTextNode('%,'));
        this.fullSpan.append(this.numberInputs.lightness);
        this.fullSpan.append(document.createTextNode('%)'));
        colorStateManger.subscribe(this.colorChangeHandler.bind(this));
        this.fullSpan.addEventListener('change', (ev) => {
            const target = ev.target;
            if (target === this.numberInputs.hue) {
                emitColorChange({
                    type: 'subtype',
                    value: {
                        type: 'hue',
                        value: parseInt(this.numberInputs.hue.value) % 360 || 0,
                    },
                    source: 'text',
                });
            }
            if (target === this.numberInputs.saturation) {
                emitColorChange({
                    type: 'subtype',
                    value: {
                        type: 'saturation',
                        value: parseInt(this.numberInputs.saturation.value) || 0,
                    },
                    source: 'text',
                });
            }
            if (target === this.numberInputs.lightness) {
                emitColorChange({
                    type: 'subtype',
                    value: {
                        type: 'lightness',
                        value: parseInt(this.numberInputs.lightness.value) || 50,
                    },
                    source: 'text',
                });
            }
        });
        parentElement.appendChild(this.fullSpan);
    }
    logState() {
        console.log(this);
    }
    colorChangeHandler(input) {
        if (input.source !== 'text') {
            this.numberInputs.hue.value = `${Math.round(input.color.hue)}`;
            this.numberInputs.saturation.value = `${Math.round(input.color.saturation)}`;
            this.numberInputs.lightness.value = `${Math.round(input.color.lightness)}`;
        }
    }
}
