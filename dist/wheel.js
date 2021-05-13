import { handle } from './handle.js';
import { colorStateManger, emitSelectedChange, resizeAlert, selectedStateManger, subComponents, } from './utilities/stateUtilities.js';
import { throttle } from './utilities/timingUtilities.js';
export { colorWheel };
class colorWheel extends subComponents {
    //#endregion class variables
    constructor(parent) {
        super();
        this.selectedHandle = -1;
        this.handles = [];
        this.touchEnabled = false;
        this.dimensions = {
            radius: -1,
            x: -1,
            y: -1,
        };
        this.name = 'wheel';
        //#region event listener implementation
        this.down = (e) => {
            e.stopImmediatePropagation();
            //if dimensions have not been set, set them
            this.setDimensions();
            /*if the element clicked was not the wheel or the current handle,
            it must be another handle, so change handles*/
            if (e.target !== this.wheel &&
                e.target !== this.handles[this.selectedHandle].handle) {
                const newSelected = this.findHandle(e.target);
                emitSelectedChange(newSelected);
                if (newSelected === -1) {
                    console.error('Selected element Not found');
                }
            }
            // console.debug(e);
            this.handles[this.selectedHandle].down(this.wheel, e);
        };
        this.up = () => {
            this.handles[this.selectedHandle].up();
        };
        this.out = () => {
            if (this.handles[this.selectedHandle].active) {
                this.handles[this.selectedHandle].up();
            }
        };
        this.moving = (e) => {
            this.handles[this.selectedHandle].moving(e);
        };
        this.click = (e) => {
            this.handles[this.selectedHandle].click(e);
            e.preventDefault();
            e.stopImmediatePropagation();
        };
        // private touchMoving = (e: TouchEvent) => {
        // 	this.handles[this.selectedHandle].touchMoving(e);
        // };
        this.throttledMove = throttle(this.moving, 16);
        this.deslectHandle = (index) => {
            if (this.handles[this.selectedHandle] !== undefined) {
                this.handles[index].deselect();
                //Reset Z index to creation order
                this.handles[index].handle.style.zIndex =
                    this.handles[index].id.toString();
            }
        };
        this.selectHandle = (input) => {
            this.handles[input].select();
            this.handles[input].handle.style.zIndex = (this.handles.length + 5).toString();
            return;
        };
        this.findHandle = (input) => {
            if (input instanceof handle) {
                const selected = this.handles.indexOf(input);
                return selected;
            }
            if (input instanceof HTMLElement) {
                const selected = this.handles.reduce((value, current, index) => {
                    if (current.handle === input) {
                        return index;
                    }
                    return value;
                }, -1);
                return selected;
            }
            return -1;
        };
        this.wheel = document.createElement('div');
        this.wheel.classList.add('colorPicker-colorWheel');
        selectedStateManger.subscribe(this.selectionHandler.bind(this));
        colorStateManger.subscribe(this.colorChangeHandler.bind(this));
        resizeAlert.subscribe(this.resize.bind(this));
        //#region event listeners
        //#region click listeners
        //Add event listeners
        this.wheel.addEventListener('mouseup', this.up);
        this.wheel.addEventListener('mouseleave', this.out);
        this.wheel.addEventListener('mousemove', this.moving);
        this.wheel.addEventListener('mousedown', this.down);
        this.wheel.addEventListener('click', this.click);
        //#endregion click listeners
        // #region touch listeners
        // if (this.touchEnabled) {
        // 	this.wheel.addEventListener('touchstart', this.down);
        // 	this.wheel.addEventListener('touchmove', this.touchMoving);
        // 	this.wheel.addEventListener('touchend', this.up);
        // }
        //#endregion touch listeners
        //#endregion event listeners
        parent.appendChild(this.wheel);
    }
    logState() {
        console.info('Logging state of Wheel');
        console.info(this);
        console.group('logging handles');
        console.info(this.handles);
        console.groupEnd();
    }
    setDimensions(force) {
        if (this.dimensions.radius === -1 || force) {
            this.dimensions.radius = this.wheel.clientWidth / 2;
            this.dimensions.x =
                this.dimensions.radius +
                    this.wheel.clientLeft +
                    this.wheel.offsetLeft;
            this.dimensions.y =
                this.dimensions.radius +
                    this.wheel.clientTop +
                    this.wheel.offsetTop;
        }
    }
    //#endregion event listener implementation
    selectionHandler(input) {
        if (typeof input === 'number') {
            this.deslectHandle(this.selectedHandle);
            this.selectedHandle = input;
            this.selectHandle(input);
        }
        else {
            if (input === 'new') {
                this.addHandle();
                return;
            }
            if (input === 'delete') {
                this.removeHandle(this.selectedHandle);
                return;
            }
        }
    }
    addHandle() {
        this.handles.push(new handle(this.wheel, this.handles.length));
    }
    removeHandle(index) {
        var _a;
        if (this.handles.length > 1) {
            //remove element from dom
            (_a = this.handles[index]) === null || _a === void 0 ? void 0 : _a.remove();
            //remove from array
            this.handles.splice(index, 1);
            //decrement all following ID's
            this.handles.slice(index).forEach((item) => {
                item.id -= 1;
            });
        }
    }
    colorChangeHandler(change) {
        this.setDimensions();
        if (this.selectedHandle >= 0) {
            this.handles[this.selectedHandle].setDimensions(this.wheel, this.handles[this.selectedHandle].dimensions.functionalRad < 1);
        }
        if ((change === null || change === void 0 ? void 0 : change.source) !== 'wheel') {
            this.wheel.style.setProperty('--lightness', `${change.color.lightness}%`);
            this.handles[this.selectedHandle].updateFromColor(change.color);
        }
    }
    resize() {
        console.debug('Wheel Resize');
        this.setDimensions(true);
        this.handles.forEach((element) => {
            console.debug('Handle Resize');
            element.setDimensions(this.wheel, true);
        });
    }
}
