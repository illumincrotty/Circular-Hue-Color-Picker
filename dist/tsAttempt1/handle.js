import { setUp, coordinateUtilities, colorUtilities, } from "./colorUtilities.js";
class handle {
    constructor(parentElement, shift, id) {
        this.saturation = 100;
        this.lightnessBase = 50;
        this.radiusSquare = 0;
        this.halfRadius = 0;
        this.locked = {
            hue: false,
            saturation: false,
            lightness: false,
        };
        this.updatePosition = (cart) => {
            this.update(cart);
        };
        // private updatePolar(polar:polarCoordinates){
        // 	this.update(polarToCart(polar),polar)
        // }
        this.update = (position = { x: 0, y: 0 }, polarPosition, color) => {
            const polar = polarPosition !== null && polarPosition !== void 0 ? polarPosition : coordinateUtilities.cartToPolar(position);
            if (this.locked.hue) {
                polar.angle = this._hueToAngle(this.color.hue);
            }
            if (this.locked.saturation) {
                this.color.saturation = this.color.saturation;
            }
            if (this.locked.lightness) {
                polar.radius = this._lightnessToRadius(this.color.lightness);
            }
            //stay within color wheel
            polar.radius = Math.min(polar.radius, this.parentRadius - this.halfRadius);
            const limPos = coordinateUtilities.polarToCart(polar);
            this._updatePosition(limPos);
            this._updateColor(color !== null && color !== void 0 ? color : this._positionToColor(polar));
        };
        this._updateColor = (color) => {
            // console.debug(`Handle Color to ${colorToCssString(color)}`);
            this.color = color;
            this.handle.dispatchEvent(colorUtilities.createColorEvent("wheel", {
                type: "hsl",
                value: color,
            }));
            this.handle.style.background = colorUtilities.colorToCssString(color);
        };
        this._positionToColor = (position = { radius: 0, angle: 0 }) => {
            return {
                hue: this.locked.hue
                    ? this.color.hue
                    : this._angletoHue(position.angle),
                saturation: this.locked.saturation
                    ? this.color.saturation
                    : this.saturation,
                lightness: this.locked.lightness
                    ? this.color.lightness
                    : this._radiusToLightness(position.radius),
            };
        };
        this._angletoHue = (angle) => {
            return 360 - ((angle + 180 + 90) % 360);
        };
        this._radiusToLightness = (rad) => {
            return (this.lightnessBase +
                50 * (1 - rad / (this.parentRadius - this.halfRadius)));
        };
        this._colorToPosition = (color) => {
            return {
                radius: this._lightnessToRadius(color.lightness),
                angle: this._hueToAngle(color.hue),
            };
        };
        this._lightnessToRadius = (lightness) => {
            return ((1 - (lightness - this.lightnessBase) / 50) *
                (this.parentRadius - this.halfRadius));
        };
        this._hueToAngle = (hue) => {
            return 360 - hue + 90;
        };
        this.resize = (parentElement, shift) => {
            this.setSizes(parentElement, shift);
        };
        this.setSizes = (parentElement, shift) => {
            this.parentRadius =
                shift -
                    parseInt(getComputedStyle(parentElement).getPropertyValue("border-left-width"));
            this.halfRadius = this.handle.clientWidth / 2;
            this.radiusSquare = Math.pow(this.handle.offsetWidth, 2);
            this.update(this.position);
        };
        this.id = id;
        //call into existence
        this.handle = document.createElement("div");
        this.handle.className = "colorPicker-handle";
        this.handle.id = "colorPicker-handle" + id;
        parentElement.appendChild(this.handle);
        this.parentRadius = shift;
        const repaint = setUp.addAndSetUp(parentElement, this.handle, "end");
        repaint.then(() => {
            this.setSizes(parentElement, shift);
        });
        this.update();
    }
    lock(type, lock) {
        console.log(`${type} is locked on handle: ${lock}`);
        this.locked[type] = lock;
    }
    colorChangeSingle(type, value) {
        const colorCopy = {
            hue: this.color.hue,
            saturation: this.color.saturation,
            lightness: this.color.lightness,
        };
        if (type === "lightness") {
            if (!this.locked[type]) {
                if (value != null) {
                    this.lightnessBase = value;
                }
                this.update(this.position);
            }
        }
        else {
            if (!this.locked[type]) {
                colorCopy[type] = value;
            }
            this.colorChange(colorCopy);
        }
    }
    hueReset() {
        this.update();
    }
    colorChange(color) {
        // console.debug(`Handle colorChange to ${colorToCssString(color)}`);
        if (this.locked.hue) {
            color.hue = this.color.hue;
        }
        if (this.locked.saturation) {
            color.saturation = this.color.saturation;
        }
        else {
            this.saturation = color.saturation;
        }
        if (this.locked.lightness) {
            color.lightness = this.color.lightness;
        }
        const polar = this._colorToPosition(color);
        const cart = coordinateUtilities.polarToCart(polar);
        this.update(cart, polar, color);
    }
    _updatePosition(position) {
        this.position = position;
        const x = this.parentRadius + position.x;
        const y = this.parentRadius - position.y;
        // console.debug(`Updating position to (${position.x},${position.y})`);
        this.handle.style.top = `${y}px`;
        this.handle.style.left = `${x}px`;
    }
}
export default handle;
