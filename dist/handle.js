import { hslColorToCssString, } from './utilities/colorUtilities.js';
import { cartToPolar, polarToCart, degreesToRadians, radiansToDegrees, } from './utilities/positionUtilities.js';
import { emitColorChange } from './utilities/stateUtilities.js';
import { throttle } from './utilities/timingUtilities.js';
export { handle };
class handle {
    //#endregion class variables
    constructor(parent, idNumber) {
        this.active = false;
        this.locked = {
            hue: false,
            saturation: false,
            lightness: false,
        };
        this.color = { hue: 0, saturation: 0, lightness: 50 };
        this.dimensions = {
            offset: -1,
            wheelBorder: -1,
            handleBorder: -1,
            functionalRad: -1,
            handleWidth: -1,
            bcrX: -1,
            bcrY: -1,
        };
        this.remove = () => {
            this.handle.remove();
        };
        //#region event listener implementation
        this.up = () => {
            this.active = false;
        };
        this.down = (parentElement, e) => {
            this.setDimensions(parentElement, this.dimensions.functionalRad < 1);
            this.active = true;
            this.click(e);
        };
        this.click = (e) => {
            const x = e.clientX - this.dimensions.bcrX;
            const y = e.clientY - this.dimensions.bcrY;
            this.updateFromPosition({
                x: x - this.dimensions.offset,
                y: y - this.dimensions.offset,
            });
        };
        this.unthrottledMove = (e) => {
            if (this.active) {
                this.click(e);
            }
        };
        this.moving = throttle(this.unthrottledMove, 30);
        this.unthrottledTouchMove = (e) => {
            if (this.active) {
                const x = e.targetTouches[0].clientX - this.dimensions.bcrX;
                const y = e.targetTouches[0].clientY - this.dimensions.bcrY;
                this.updateFromPosition({
                    x: x - this.dimensions.offset,
                    y: y - this.dimensions.offset,
                });
            }
        };
        this.touchMoving = throttle(this.unthrottledTouchMove, 30);
        //#endregion event listener implementation
        this.select = () => {
            this.handle.focus();
            this.handle.style.setProperty('--scaleFactor', `1.2`);
            this.handle.style.setProperty('--borderColor', `var(--Main)`);
        };
        this.deselect = () => {
            this.handle.style.scale = '';
            this.handle.style.setProperty('--scaleFactor', `1`);
            this.handle.style.setProperty('--borderColor', `var(--Secondary)`);
        };
        this.updateFromPosition = (pt) => {
            this.update(this.colorToPoints(this.polarToColor(cartToPolar(pt))));
        };
        this.updateFromColor = (color) => {
            this.updateHelper(this.colorToPoints(color));
        };
        this.colorToPoints = (color) => {
            if (this.locked.hue) {
                color.hue = this.color.hue;
            }
            if (this.locked.saturation) {
                color.saturation = this.color.saturation;
            }
            if (this.locked.lightness) {
                color.lightness = this.color.lightness;
            }
            const pt = polarToCart(this.colorToPolarCoordinates(color));
            return [pt, color];
        };
        this.colorToPolarCoordinates = (color) => {
            var _a, _b;
            return {
                theta: (_a = degreesToRadians(color.hue - 90)) !== null && _a !== void 0 ? _a : 0,
                radius: (_b = Math.min((color.saturation / 100) * this.dimensions.functionalRad, this.dimensions.functionalRad)) !== null && _b !== void 0 ? _b : 0,
            };
        };
        this.polarToColor = (pt) => {
            return {
                hue: (radiansToDegrees(pt.theta) + 360 + 90) % 360,
                saturation: 100 *
                    (Math.min(pt.radius, this.dimensions.functionalRad) /
                        this.dimensions.functionalRad) || 0,
                lightness: this.color.lightness,
            };
        };
        this.updateColor = (color) => {
            this.color = color;
            this.handle.style.backgroundColor = hslColorToCssString(color);
        };
        this.updatePosition = (pt) => {
            this.handle.style.setProperty('--handleXOffset', `${pt.x}`);
            this.handle.style.setProperty('--handleYOffset', `${pt.y}`);
        };
        //create element and add its class
        this.handle = document.createElement('div');
        this.handle.classList.add('colorPicker-handle');
        // this.handle.tabIndex = 0;
        this.id = idNumber;
        this.select();
        //add self to dom
        parent.appendChild(this.handle);
    }
    setDimensions(parent, force) {
        var _a;
        if (this.dimensions.offset === -1 || force) {
            const wheelDimensions = parent.getBoundingClientRect();
            const handleDimensions = this.handle.getBoundingClientRect();
            this.dimensions.handleBorder = parseFloat(getComputedStyle(this.handle).borderTopWidth.slice(0, -2));
            this.dimensions.wheelBorder = parseFloat(getComputedStyle(parent).borderTopWidth.slice(0, -2));
            this.dimensions.handleWidth = handleDimensions.width;
            this.dimensions.offset = wheelDimensions.width / 2;
            this.dimensions.functionalRad =
                (_a = wheelDimensions.width / 2 -
                    this.dimensions.wheelBorder -
                    (handleDimensions.width / 2 -
                        this.dimensions.handleBorder)) !== null && _a !== void 0 ? _a : 0;
            this.dimensions.bcrX = wheelDimensions.x;
            this.dimensions.bcrY = wheelDimensions.y;
        }
    }
    update(input) {
        emitColorChange({
            type: 'full',
            value: this.updateHelper(input),
            source: 'wheel',
        });
    }
    updateHelper(input) {
        this.updateColor(input[1]);
        this.updatePosition(input[0]);
        return input[1];
    }
}
