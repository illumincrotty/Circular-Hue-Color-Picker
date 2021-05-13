import { defaultColor, } from './colorUtilities.js';
export class subComponents {
}
class PubSub {
    constructor() {
        this.eventSet = new Set();
    }
    subscribe(fn) {
        this.eventSet.add(fn);
    }
    unsubscribe(fn) {
        this.eventSet.delete(fn);
    }
    notify(event) {
        return this.eventSet.forEach((fn) => fn(event));
    }
}
export const colorStateManger = new PubSub();
export const selectedStateManger = new PubSub();
export const resizeAlert = new PubSub();
export const emitSelectedChange = (input) => {
    if (typeof input == 'string') {
        if (input === 'new') {
            currentSelectedIndex = colors.push(defaultColor()) - 1;
            selectedStateManger.notify('new');
            selectedStateManger.notify(colors.length - 1);
        }
        if (input === 'delete') {
            if (colors.length > 1) {
                colors.splice(currentSelectedIndex, 1);
                currentSelectedIndex = colors.length - 1;
                selectedStateManger.notify('delete');
                selectedStateManger.notify(currentSelectedIndex);
            }
            else {
                console.warn('attempting to remove only color');
            }
        }
        colorStateManger.notify({
            color: colors[currentSelectedIndex],
            source: 'component',
        });
    }
    else {
        if (input < colors.length) {
            currentSelectedIndex = input;
        }
        selectedStateManger.notify(currentSelectedIndex);
        colorStateManger.notify({
            color: colors[currentSelectedIndex],
            source: 'component',
        });
    }
};
export const emitColorChange = (input) => {
    if (input.type === 'full') {
        colors[currentSelectedIndex] = input.value;
    }
    if (input.type === 'subtype') {
        colors[currentSelectedIndex][input.value.type] = input.value.value;
    }
    colorStateManger.notify({
        color: colors[currentSelectedIndex],
        source: input.source,
    });
};
const colors = [];
let currentSelectedIndex = -1;
