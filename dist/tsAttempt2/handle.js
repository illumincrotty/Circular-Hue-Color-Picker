import { colorUtils as cu, timingUtils as tu, positionsUtils as pu, } from './utilities.js';
export { handle };
class handle {
    //#endregion class variables
    constructor(parent, idNumber, changeFunction) {
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
            console.debug('Removing Self');
            this.handle.remove();
        };
        //#region event listener implementation
        this.up = () => {
            this.active = false;
        };
        this.down = (parentElement) => {
            this.setDimensions(parentElement);
            this.active = true;
        };
        this.unthrottledMove = (e) => {
            if (this.active) {
                this.click(e);
            }
        };
        this.click = (e) => {
            const x = e.clientX - this.dimensions.bcrX;
            const y = e.clientY - this.dimensions.bcrY;
            this.updateFromPosition({
                x: x - this.dimensions.offset,
                y: y - this.dimensions.offset,
            });
        };
        this.unthrottledTouchMove = (e) => {
            const x = e.targetTouches[0].clientX - this.dimensions.bcrX;
            const y = e.targetTouches[0].clientY - this.dimensions.bcrY;
            this.updateFromPosition({
                x: x - this.dimensions.offset,
                y: y - this.dimensions.offset,
            });
        };
        this.moving = tu.throttle(this.unthrottledMove, 16);
        this.touchMoving = tu.throttle(this.unthrottledTouchMove, 30);
        //#endregion event listener implementation
        this.select = () => {
            this.handle.style.setProperty('--scaleFactor', `1.2`);
            this.handle.style.setProperty('--borderColor', `var(--Main)`);
        };
        this.deselect = () => {
            this.handle.style.scale = '';
            this.handle.style.setProperty('--scaleFactor', `1`);
            this.handle.style.setProperty('--borderColor', `var(--Secondary)`);
        };
        this.updateFromPosition = (pt) => {
            this.updateFromColor(this.polarToColor(pu.cartToPolar(pt)));
        };
        this.updateFromColor = (color) => {
            if (this.locked.hue) {
                color.hue = this.color.hue;
            }
            if (this.locked.saturation) {
                color.saturation = this.color.saturation;
            }
            if (this.locked.lightness) {
                color.lightness = this.color.lightness;
            }
            const pt = pu.polarToCart(this.colorToPolarCoordinates(color));
            this.update(pt, color);
        };
        this.updateFromColorSubtype = (change) => {
            const currentColor = cu.colorCopy(this.color);
            currentColor[change.type] = change.value;
            this.updateFromColor(currentColor);
        };
        this.colorToPolarCoordinates = (color) => {
            return {
                theta: pu.degreesToRadians(color.hue - 90),
                radius: Math.min((color.saturation / 100) *
                    this.dimensions.functionalRad, this.dimensions.functionalRad),
            };
        };
        this.polarToColor = (pt) => {
            return {
                hue: (pu.radiansToDegrees(pt.theta) + 360 + 90) % 360,
                saturation: 100 *
                    (Math.min(pt.radius, this.dimensions.functionalRad) /
                        this.dimensions.functionalRad),
                lightness: this.color.lightness,
            };
        };
        this.updateColor = (color) => {
            // const colString = cu.hslColorToCssString(color);
            // console.debug(colString);
            this.color = color;
            this.handle.style.backgroundColor = cu.hslColorToCssString(color);
        };
        this.updatePosition = (pt) => {
            this.handle.style.setProperty('--handleXOffset', `${pt.x}`);
            this.handle.style.setProperty('--handleYOffset', `${pt.y}`);
        };
        //create element and add its class
        this.handle = document.createElement('div');
        this.handle.classList.add('colorPicker-handle');
        this.id = idNumber;
        this.select();
        this.changeFunction = changeFunction;
        //add self to dom
        parent.appendChild(this.handle);
    }
    setDimensions(parent) {
        if (this.dimensions.offset === -1) {
            const wheelDimensions = parent.getBoundingClientRect();
            const handleDimensions = this.handle.getBoundingClientRect();
            this.dimensions.handleBorder = parseFloat(getComputedStyle(this.handle).borderTopWidth.slice(0, -2));
            this.dimensions.wheelBorder = parseFloat(getComputedStyle(parent).borderTopWidth.slice(0, -2));
            this.dimensions.handleWidth = handleDimensions.width;
            this.dimensions.offset = wheelDimensions.width / 2;
            this.dimensions.functionalRad =
                wheelDimensions.width / 2 -
                    this.dimensions.wheelBorder -
                    (handleDimensions.width / 2 -
                        this.dimensions.handleBorder);
            this.dimensions.bcrX = wheelDimensions.x;
            this.dimensions.bcrY = wheelDimensions.y;
            console.debug(this.dimensions);
        }
    }
    update(cartPt, color) {
        // console.debug('Update');
        // console.debug(cartPt);
        // console.debug(color);
        this.changeFunction({
            type: 'full',
            value: this.updateHelper(cartPt, color),
            source: 'wheel',
        });
    }
    updateHelper(cartPt, color) {
        this.updateColor(color);
        this.updatePosition(cartPt);
        return color;
    }
}
