import { setUp, coordinateUtilities, } from "./colorUtilities.js";
import handle from "./handle.js";
class colorWheel {
    constructor(parentElement, id) {
        //animation tools
        this.isMouseDown = false;
        this.needRAF = false;
        this.setUp = () => {
            const rad = this._colorWheelElement.getBoundingClientRect().width / 2;
            if (colorWheel.logging) {
                console.debug("Constructing circle");
                console.debug(this._colorWheelElement.getBoundingClientRect());
                console.debug(`Radius = ${rad}`);
            }
            return {
                radius: rad,
                center: {
                    x: this._colorWheelElement.getBoundingClientRect().left + rad,
                    y: this._colorWheelElement.getBoundingClientRect().top + rad,
                },
            };
        };
        this.addHandle = () => {
            if (colorWheel.logging) {
                console.debug(`Adding handle, radius: ${this._circle.radius}`);
            }
            this.handles.push(new handle(this._colorWheelElement, this._circle.radius, this.id + "-" + this.handles.length));
            this.selected = this.handles[this.handles.length - 1];
        };
        this.mouseDown = (e) => {
            //Convert event into more useful format
            const click = this.mouseEventToCartCoords(e);
            this.handles.some((handle) => {
                if (handle.radiusSquare <
                    coordinateUtilities.cartDistanceSquare(handle.position, click)) {
                    this.selected = handle;
                    return true;
                }
            });
            e.preventDefault();
            this.isMouseDown = true;
            // this.selected.update(click);
            this.startPos = click;
            this.currentPos = click;
        };
        this.mouseMove = (e) => {
            e.preventDefault();
            this.currentPos = this.mouseEventToCartCoords(e);
            if (this.isMouseDown && this.needRAF) {
                this.needRAF = false; // no need to call rAF up until next frame
                requestAnimationFrame(this.handleUpdate);
            }
        };
        this.mouseUp = (e) => {
            e.preventDefault;
            this.isMouseDown = false;
            this.currentPos = this.mouseEventToCartCoords(e);
            requestAnimationFrame(this.handleUpdate);
        };
        this.handleUpdate = () => {
            this.needRAF = true;
            this.selected.updatePosition(this.currentPos);
        };
        this.mouseEventToCartCoords = (e) => {
            return {
                x: e.clientX - this._circle.center.x,
                y: this._circle.center.y - e.clientY,
            };
        };
        this.id = id;
        //add color wheel to dom
        this._colorWheelElement = document.createElement("div");
        this._colorWheelElement.className = "colorPicker-colorWheel";
        this._colorWheelElement.id = `colorPicker-colorWheel-${this.id}`;
        const repaint = setUp.addAndSetUp(parentElement, this._colorWheelElement, "front");
        repaint.then(() => {
            this._circle = this.setUp();
            //add default handle
            this.addHandle();
        });
        this.handles = [];
        this._colorWheelElement.addEventListener("mousedown", this.mouseDown.bind(this));
        this._colorWheelElement.addEventListener("mousemove", this.mouseMove.bind(this));
        this._colorWheelElement.addEventListener("mouseup", this.mouseUp.bind(this));
    }
    colorChange(changeEvent) {
        // const change = changeEvent.change;
        if (typeof changeEvent.change.value === "number") {
            const { type, value } = changeEvent.change;
            if (changeEvent.lock !== undefined) {
                this.selected.lock(type, changeEvent.lock);
            }
            else {
                if (type === "hue") {
                    if (changeEvent.reset) {
                        this.selected.hueReset();
                    }
                    else {
                        this.selected.colorChangeSingle("hue", value);
                    }
                }
                if (type === "saturation") {
                    this._colorWheelElement.style.setProperty("--displayS", `${value}%`);
                    this.selected.colorChangeSingle("saturation", value);
                }
                if (type === "lightness") {
                    if (value > 50) {
                        this._colorWheelElement.style.setProperty("--radialFirstOpacity", `${1}`);
                        this._colorWheelElement.style.setProperty("--radialSecondOpacity", `${(value - 50) / 50}`);
                        this._colorWheelElement.style.setProperty("--radialSecondLightness", `${100}%`);
                    }
                    if (value <= 50) {
                        this._colorWheelElement.style.setProperty("--radialFirstOpacity", `${0.5 + value / 100}`);
                        this._colorWheelElement.style.setProperty("--radialSecondOpacity", `${1 - value / 50}`);
                        this._colorWheelElement.style.setProperty("--radialSecondLightness", `${0}%`);
                    }
                    if (colorWheel.logging) {
                        console.log(`Setting lightness to ${value}`);
                    }
                    this.selected.colorChangeSingle("lightness", value);
                }
            }
        }
        else {
            this.selected.colorChange(changeEvent.change.value);
        }
    }
    clicked(e) {
        if (colorWheel.logging) {
            console.debug(e);
            console.debug(this._colorWheelElement.getBoundingClientRect());
            console.debug(this._colorWheelElement.clientWidth);
        }
        //Convert event into more useful format
        const click = this.mouseEventToCartCoords(e);
        //Loggging
        if (colorWheel.logging) {
            console.debug(e);
            console.info(`Wheel click at C(${click.x.toFixed(2)},${click.y.toFixed(2)})`);
        }
        this.selected.updatePosition(click);
    }
    resize() {
        if (colorWheel.logging) {
            console.info("Resizing Color Wheel");
        }
        this._circle = this.setUp();
        this.handles.forEach((element) => {
            element.resize(this._colorWheelElement, this._circle.radius);
        });
    }
}
colorWheel.logging = false;
export default colorWheel;
